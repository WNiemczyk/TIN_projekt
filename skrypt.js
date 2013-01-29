/*jshint node: true, browser: true, jquery: true */
/*global io: false */
$(document).ready(function () {
    'use strict';
    var socket = io.connect('http://localhost:3030');


    console.log('connecting…');

    socket.on('connect', function () {
        console.log('connected!');
    });

    $('#responseOutput').css('display', 'none');

    $('#login_button').click(function() {
        var form = {
            name: $('#name').val(),
            password : $('#password').val()
        };

        console.log(form);
        socket.emit('login', form);
    });



    socket.on('login', function(msg) {
        $('#login_output').append(msg);
        $('#login_form').css('display', 'none');
        $('#responseOutput').css('display', 'block');
                var form = '';
                form += '<p><input type="text" name="productName" id="productName"/> <label>name<label></p>';
                form += '<p><input type="text" name="ea" id="ea"/> <label>ea<label></p>';
                form += '<p><button id="list_button">Send</button></p>';
                $('#responseOutput').append(form);

                    $('#list_button').click(function() {
                        var formInsertProduct = {
                            productName: $('#productName').val(),
                            ea : $('#ea').val()
                        };

                    socket.emit('insertProduct', formInsertProduct);

                    });

                    socket.on('insertedProduct', function(msg) {
                        
                        $('#responseOutput').css('display', 'block');
                        $('#responseOutput').append(msg);
                        
                    });

    });

    socket.on('errorLogin', function(msg){
        $('#login_output').append(msg);
    });
});
