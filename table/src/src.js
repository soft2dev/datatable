$(document).ready(function() {
    var current_count = 5;
    var current_page = 1;
    var row_account = 0;
    var json = null;
    var string1 = '';
    var string3 = '';
    var editTable = function editTable() {
        var OriginalContent = $(this).text();
        $(this).addClass("cellEditing");
        $(this).html("<input class='input' type='text' value='" + OriginalContent + "' />");
        $(this).children().first().focus();
        $(this).children().first().keypress(function(e) {
            // alert(e.keyCode);
            if (e.keyCode == 9) {
                var next_td = $(this).parents('td').index();
                var next_tr = $(this).parents('tr').index();
                var length = $(this).parents('tr').find('td').length;
                if (next_td == length - 1) {
                    next_td = 0;
                    next_tr += 1;
                }
                $('#example tbody').find('tr').eq(next_tr).find('td').eq(next_td + 1).trigger('dblclick');
            }
            if (e.keyCode == 13) {
                var newContent = $(this).val();
                var next_td = $(this).parents('td').index();
                var next_tr = $(this).parents('tr').index();
                var length = $(this).parents('tr').find('td').length;
                $('#hidden_table tbody').find('tr').eq(parseInt($('f_entry').text() + next_tr)).find('td').eq(next_td).text(newContent);
                if (next_td == 1) json[parseInt($('f_entry').text() + next_tr)].name = newContent;
                if (next_td == 2) json[parseInt($('f_entry').text() + next_tr)].position = newContent;
                if (next_td == 3) json[parseInt($('f_entry').text() + next_tr)].office = newContent;
                if (next_td == 4) json[parseInt($('f_entry').text() + next_tr)].age = newContent;
                if (next_td == 5) json[parseInt($('f_entry').text() + next_tr)].startdate = newContent;
                if (next_td == 6) json[parseInt($('f_entry').text() + next_tr)].salary = newContent;

                if (next_td == length - 1) {
                    next_td = 0;
                    next_tr += 1;
                }
                $(this).parents('td').text(newContent);
                $(this).parents('td').removeClass("cellEditing");

                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    async: false,
                    url: 'save_json.php',
                    data: { data: JSON.stringify(json) },
                    success: function() { alert('ok') },
                    failure: function() { alert('failed') }
                });
            }
        });
        $(this).children().first().blur(function() {
            $(this).parent().text(OriginalContent);
            $(this).parent().removeClass("cellEditing");
        });
    }

    function getJSON() {
        var row = 0;
        $.getJSON("src/data1.json", function(result) {
            json = result;
            var string = '';
            row_account = result.length;
            $.each(result, function(i, field) {
                // $("#example tbody").append(field['name'] + " ");
                if (i % 2 == 0) var add = "class='odd row'";
                else var add = "class='even row'";
                string += "<tr role='row'" + add + ">" +
                    "<td class='td'></td>" +
                    "<td>" + field['name'] + "</td>" +
                    "<td>" + field['position'] + "</td>" +
                    "<td>" + field['office'] + "</td>" +
                    "<td>" + field['age'] + "</td>" +
                    "<td>" + field['startdate'] + "</td>" +
                    "<td>" + field['salary'] + "</td>" + "</tr>";
                row++;
            });
            $('#hidden_table tbody').html(string);
            showTable(current_count, current_page);
            string1 = string;
        });
    }
    getJSON();

    function showTable(count, page) {
        var row = 0;
        var string = '';
        var result = $('.row');
        row_account = result.length;
        $.each(result, function(i, field) {
            if (count * (page - 1) <= i && i <= count * page - 1) {
                // $("#example tbody").append(field['name'] + " ");
                if (i % 2 == 0) var add = "class='odd'";
                else var add = "class='even'";
                string += "<tr role='row'" + add + ">" +
                    "<td>" + (i + 1) + "</td>" +
                    "<td>" + $(field).find('td').eq(1).text() + "</td>" +
                    "<td>" + $(field).find('td').eq(2).text() + "</td>" +
                    "<td>" + $(field).find('td').eq(3).text() + "</td>" +
                    "<td>" + $(field).find('td').eq(4).text() + "</td>" +
                    "<td>" + $(field).find('td').eq(5).text() + "</td>" +
                    "<td>" + $(field).find('td').eq(6).text() + "</td>" + "</tr>";
                row++;
            }
        });
        $('#example tbody').html('');
        $('#example tbody').html(string);
        $("td").dblclick(editTable);
        $('#c_page').text(page);
        $('#t_page').text(parseInt(row_account / current_count) + 1);
        $('#f_entry').text(count * (page - 1) + 1);
        if (count * page > row_account) $('#l_entry').text(row_account);
        else $('#l_entry').text(count * page);
        $('#t_entry').text(row_account);
    }
    $('#example_length').change(function() {
        current_count = parseInt($('#example_length option:selected').val());
        showTable(current_count, current_page);
    })
    $('#example_first').click(function() {
        current_page = 1;
        showTable(current_count, current_page);
    })
    $('#example_previous').click(function() {
        current_page--;
        if (current_page < 1) current_page = 1;
        showTable(current_count, current_page);
    })
    $('#example_next').click(function() {
        current_page++;
        if (current_page > (parseInt(row_account / current_count) + 1)) current_page = parseInt(row_account / current_count) + 1;
        showTable(current_count, current_page);
    })
    $('#example_last').click(function() {
        current_page = parseInt(row_account / current_count) + 1;
        showTable(current_count, current_page);
    })
    $('#search').keyup(function(e) {
        var check = false;
        current_page = 1;
        var char = $(this);
        var a = '';
        $.each($('#hidden_table tbody').find('tr'), function(i, tr) {
            $(tr).removeClass('row');
            $.each($(tr).find('td'), function(j, td) {
                if ($(td).text().indexOf(char.val()) >= 0) {
                    $('#hidden_table tbody').find('tr').eq(i).addClass('row');
                    console.log($(td).text(), $(tr).html(), $(td).text().indexOf(char.val()));
                }
            })
        });
        showTable(current_count, 1);
    });

    function Ascending(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    function Descending(a, b) {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
    }
    var flag = true;
    $('#example th').click(function() {
        var $th = $(this).closest('th');
        var column = $th.index();
        $('#hidden_table th').eq(column).trigger('click');
        showTable(current_count, 1);
    })
    $('#hidden_table th').click(function() {
        var $th = $(this).closest('th');
        var column = $th.index();
        var $table = $th.closest('table');
        var rows = $table.find('tbody > tr').get();
        rows.sort(function(rowA, rowB) {
            var keyA = $(rowA).children('td').eq(column).text().toUpperCase();
            var keyB = $(rowB).children('td').eq(column).text().toUpperCase();
            if (flag) return Ascending(keyA, keyB);
            else return Descending(keyA, keyB);
        });
        $.each(rows, function(index, row) {
            $table.children('tbody').append(row);
        });
        flag = !flag;
        return false;
    })
});