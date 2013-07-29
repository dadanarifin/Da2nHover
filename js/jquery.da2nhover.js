/*
 * da2nhover jQuery Image Hover Plugin
 * http://dadanarifin.com
 *
 * Copyright 2013, Dadan Arifin
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */
(function($) {
    $.fn.da2nhover = function(options) {
        // Create some defaults, extending them with any options that were provided
        //hovereffect: normal,sliceDown,sliceDownLeft,sliceUp,sliceUpLeft
        var settings = $.extend( {
            'startEffect'   : 'transparent',
            'hoverEffect'   : 'normal',
            'imageOpacity'  : 0.5,
            'animSpeed'     : 300,
            'fillColor'     : '#000',
            'textColor'     : '#fff',
            'overlayText'   : '',
            'slices'        : 10,
            'boxCols'       : 5,
            'boxRows'       : 3,
            'MarginOut'  : 10,
            'ShadowOut'  : 10
        }, options);
        //wrap it with div
        //$(this).one('load',function(){
        $(this).one('load', function() {
            // do stuff

            $(this).wrap(function(){
                return '<div class="da2nhover-wrapper '+$(this).attr('class')+'" style="width:'+$(this).width()+'px; height:'+$(this).height()+'px;"/>';
            });
            $(this).parent().append('<div class="da2nhover-before '+$(this).attr('class')+'" style="display:none;width:'+$(this).width()+'px; height:'+$(this).height()+'px;"><img src="'+$(this).attr('src')+'"/></div>');
            $(this).parent().append('<div class="da2nhover-after '+$(this).attr('class')+'" style="display:none;width:'+$(this).width()+'px; height:'+$(this).height()+'px;"></div>');
            //set start effect
            if(settings.startEffect=="transparent")
            {
                $(this).hide();
                $(this).siblings('.da2nhover-before').css({
                    '-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+settings.imageOpacity*100+')"',
                    'filter': 'alpha(opacity='+settings.imageOpacity*100+')',
                    '-moz-opacity': settings.imageOpacity,
                    '-khtml-opacity': settings.imageOpacity,
                    'opacity': settings.imageOpacity
                }).show();
            }
            else if(settings.startEffect=="grayscale")
            {
                var element=$(this);
                element.hide();
                element.siblings('.da2nhover-before').show();
                element.siblings('.da2nhover-before').children('img').each(function(){
                    this.src = grayscale(this.src);
                });
            }
            else if(settings.startEffect=="normal")
            {
                $(this).hide();
                $(this).siblings('.da2nhover-before').show();
            }
            else if(settings.startEffect=="overlay")
            {
                element=$(this);
                element.hide();
                $(this).siblings('.da2nhover-before').html(settings.overlayText).css({
                    '-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+settings.imageOpacity*100+')"',
                    'filter': 'alpha(opacity='+settings.imageOpacity*100+')',
                    '-moz-opacity': settings.imageOpacity,
                    '-khtml-opacity': settings.imageOpacity,
                    'opacity': settings.imageOpacity,
                    'background':settings.fillColor,
                    'color':settings.textColor
                }).fadeIn();
                element.show();
            }
            //binding events for mouseover
            $(this).parent().bind('mouseenter',function(){
                if(settings.hoverEffect=='normal')
                {
                    var element=$(this);
                    element.children('.da2nhover-after').html('<img src="'+element.children('img').attr('src')+'"/>').fadeIn(settings.animSpeed);
                }
                else if(settings.hoverEffect=='popout')
                {
                    element=$(this);
                    var curWidthGambar=element.children('img').width();
                    var curHeightGambar=element.children('img').height();
                    element.children('.da2nhover-after').html('<img src="'+element.children('img').attr('src')+'"/>');
                    var popOutImage=element.children('.da2nhover-after').children('img');
                    popOutImage.width(curWidthGambar+2*settings.MarginOut);
                    popOutImage.height(curHeightGambar+2*settings.MarginOut);
                    element.children('.da2nhover-after').width(curWidthGambar+2*settings.MarginOut);
                    element.children('.da2nhover-after').height(curHeightGambar+2*settings.MarginOut);
                    element.children('.da2nhover-after').css({
                        'left':'-'+settings.MarginOut+'px',
                        'top':'-'+settings.MarginOut+'px',
                        'box-shadow':'0px 0px '+settings.ShadowOut+'px #000'
                    }).show();
                }
                else if(settings.hoverEffect=='sliceDown' || settings.hoverEffect=='sliceDownLeft'|| settings.hoverEffect=='sliceUp' || settings.hoverEffect=='sliceUpLeft' || settings.hoverEffect=='sliceUpRandom' || settings.hoverEffect=='sliceDownRandom')
                {
                    $(this).children('.da2nhover-after').show();
                    createSlices($(this),settings);
                    var timeBuff = 0;
                    var i = 0;
                    var slices =  $('.da2nhover-slice', $(this));
                    if(settings.hoverEffect == 'sliceDownLeft' || settings.hoverEffect=='sliceUpLeft') slices = $('.da2nhover-slice', $(this))._reverse();
                    if(settings.hoverEffect=='sliceUpRandom' || settings.hoverEffect=='sliceDownRandom') slices = shuffle($('.da2nhover-slice', $(this)));
                    slices.each(function(){
                        var slice = $(this);
                        if(settings.hoverEffect=='sliceDown' || settings.hoverEffect=='sliceDownLeft'){
                            slice.css({
                                'top': '0px'
                            });
                        }
                        else if(settings.hoverEffect=='sliceUp' || settings.hoverEffect=='sliceUpLeft')
                        {
                            slice.css({
                                'bottom': '0px'
                            });
                        }
                      
                        if(i == settings.slices-1){
                            setTimeout(function(){
                                slice.animate({
                                    height:'100%',
                                    opacity:'1.0'
                                }, settings.animSpeed, '', function(){
                                    //event to fire when animation finish
                                    });
                            }, (100 + timeBuff));
                        } else {
                            setTimeout(function(){
                                slice.animate({
                                    height:'100%',
                                    opacity:'1.0'
                                }, settings.animSpeed);
                            }, (100 + timeBuff));
                        }
                        timeBuff += 50;
                        i++;
                    });
                }
                else if(settings.hoverEffect == 'sliceUpDown' || settings.hoverEffect == 'sliceUpDownLeft'){
                    $(this).children('.da2nhover-after').show();
                    createSlices($(this),settings);
                    timeBuff = 0;
                    i = 0;
                    var v = 0;
                    slices =  $('.da2nhover-slice', $(this));
                    if(settings.hoverEffect == 'sliceUpDownLeft') slices = $('.da2nhover-slice', $(this))._reverse();

                    slices.each(function(){
                        var slice = $(this);
                        if(i == 0){
                            slice.css('top','0px');
                            i++;
                        } else {
                            slice.css('bottom','0px');
                            i = 0;
                        }

                        if(v == settings.slices-1){
                            setTimeout(function(){
                                slice.animate({
                                    height:'100%',
                                    opacity:'1.0'
                                }, settings.animSpeed, '', function(){
                                    //event when animation finish
                                    });
                            }, (100 + timeBuff));
                        } else {
                            setTimeout(function(){
                                slice.animate({
                                    height:'100%',
                                    opacity:'1.0'
                                }, settings.animSpeed);
                            }, (100 + timeBuff));
                        }
                        timeBuff += 50;
                        v++;
                    });
                }
                else if(settings.hoverEffect == 'fold'||settings.hoverEffect == 'foldLeft'){
                    $(this).children('.da2nhover-after').show();
                    element=$(this);
                    createSlices(element,settings);
                    timeBuff = 0;
                    i = 0;
                    slices=$('.da2nhover-slice', element);
                    if(settings.hoverEffect == 'foldLeft') slices = $('.da2nhover-slice', $(this))._reverse();
                    slices.each(function(){
                        var slice = $(this);
                        var origWidth = slice.width();
                        slice.css({
                            top:'0px',
                            height:'100%',
                            width:'0px'
                        });
                        if(i == settings.slices-1){
                            setTimeout(function(){
                                slice.animate({
                                    width:origWidth,
                                    opacity:'1.0'
                                }, settings.animSpeed, '', function(){
                                    //trigger when animation finish
                                    });
                            }, (100 + timeBuff));
                        } else {
                            setTimeout(function(){
                                slice.animate({
                                    width:origWidth,
                                    opacity:'1.0'
                                }, settings.animSpeed);
                            }, (100 + timeBuff));
                        }
                        timeBuff += 50;
                        i++;
                    });
                }
                else if(settings.hoverEffect == 'boxRandom'){
                    $(this).children('.da2nhover-after').show();
                    element=$(this);
                    createBoxes(element, settings);
                    var totalBoxes = settings.boxCols * settings.boxRows;
                    i = 0;
                    timeBuff = 0;

                    var boxes = shuffle($('.da2nhover-box', element));
                    boxes.each(function(){
                        var box = $(this);
                        if(i == totalBoxes-1){
                            setTimeout(function(){
                                box.animate({
                                    opacity:'1'
                                }, settings.animSpeed, '', function(){});
                            }, (100 + timeBuff));
                        } else {
                            setTimeout(function(){
                                box.animate({
                                    opacity:'1'
                                }, settings.animSpeed);
                            }, (100 + timeBuff));
                        }
                        timeBuff += 20;
                        i++;
                    });
                }
                else if(settings.hoverEffect == 'boxRain' || settings.hoverEffect == 'boxRainReverse' || settings.hoverEffect == 'boxRainGrow' || settings.hoverEffect == 'boxRainGrowReverse'){
                    $(this).children('.da2nhover-after').show();
                    element=$(this);
                    createBoxes(element, settings);

                    totalBoxes = settings.boxCols * settings.boxRows;
                    i = 0;
                    timeBuff = 0;

                    // Split boxes into 2D array
                    var rowIndex = 0;
                    var colIndex = 0;
                    var box2Darr = new Array();
                    box2Darr[rowIndex] = new Array();
                    boxes = $('.da2nhover-box', element);
                    if(settings.hoverEffect == 'boxRainReverse' || settings.hoverEffect == 'boxRainGrowReverse'){
                        boxes = $('.da2nhover-box', element)._reverse();
                    }
                    boxes.each(function(){
                        box2Darr[rowIndex][colIndex] = $(this);
                        colIndex++;
                        if(colIndex == settings.boxCols){
                            rowIndex++;
                            colIndex = 0;
                            box2Darr[rowIndex] = new Array();
                        }
                    });

                    // Run animation
                    for(var cols = 0; cols < (settings.boxCols * 2); cols++){
                        var prevCol = cols;
                        for(var rows = 0; rows < settings.boxRows; rows++){
                            if(prevCol >= 0 && prevCol < settings.boxCols){
                                (function(row, col, time, i, totalBoxes) {
                                    var box = $(box2Darr[row][col]);
                                    var w = box.width();
                                    var h = box.height();
                                    if(settings.hoverEffect == 'boxRainGrow' || settings.hoverEffect == 'boxRainGrowReverse'){
                                        box.width(0).height(0);
                                    }
                                    if(i == totalBoxes-1){
                                        setTimeout(function(){
                                            box.animate({
                                                opacity:'1',
                                                width:w,
                                                height:h
                                            }, settings.animSpeed/1.3, '', function(){
                                                //animation complete event
                                                });
                                        }, (100 + time));
                                    } else {
                                        setTimeout(function(){
                                            box.animate({
                                                opacity:'1',
                                                width:w,
                                                height:h
                                            }, settings.animSpeed/1.3);
                                        }, (100 + time));
                                    }
                                })(rows, prevCol, timeBuff, i, totalBoxes);
                                i++;
                            }
                            prevCol--;
                        }
                        timeBuff += 100;
                    }
                }
            });
            //binding events for mouseleave
            $(this).parent().bind('mouseleave',function(){
                $(this).children('.da2nhover-after').html('').hide();
            });

        }).each(function() {
            if(this.complete) $(this).load();
        });
        //});
        return $(this);

        // Add slices for slice animations
        function createSlices(element, settings){
            for(var i = 0; i < settings.slices; i++){
                var sliceWidth = Math.round(element.width()/settings.slices);
                if(i == settings.slices-1){
                    element.children('.da2nhover-after').append(
                        $('<div class="da2nhover-slice"></div>').css({
                            left:(sliceWidth*i)+'px',
                            width:(element.width()-(sliceWidth*i))+'px',
                            height:'0px',
                            opacity:'0',
                            background: 'url("'+ element.children('img').attr('src') +'") no-repeat -'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px 0%'
                        })
                        );
                } else {
                    element.children('.da2nhover-after').append(
                        $('<div class="da2nhover-slice"></div>').css({
                            left:(sliceWidth*i)+'px',
                            width:sliceWidth+'px',
                            height:'0px',
                            opacity:'0',
                            background: 'url("'+ element.children('img').attr('src') +'") no-repeat -'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px 0%'
                        })
                        );
                }
            }
        }
        // Add boxes for box animations
        function createBoxes(element, settings){
            var boxWidth = Math.round(element.width()/settings.boxCols);
            var boxHeight = Math.round(element.height()/settings.boxRows);

            for(var rows = 0; rows < settings.boxRows; rows++){
                for(var cols = 0; cols < settings.boxCols; cols++){
                    if(cols == settings.boxCols-1){
                        element.children('.da2nhover-after').append(
                            $('<div class="da2nhover-box"></div>').css({
                                opacity:0,
                                left:(boxWidth*cols)+'px',
                                top:(boxHeight*rows)+'px',
                                width:(element.width()-(boxWidth*cols))+'px',
                                height:boxHeight+'px',
                                background: 'url("'+element.children('img').attr('src') +'") no-repeat -'+ ((boxWidth + (cols * boxWidth)) - boxWidth) +'px -'+ ((boxHeight + (rows * boxHeight)) - boxHeight) +'px'
                            })
                            );
                    } else {
                        element.children('.da2nhover-after').append(
                            $('<div class="da2nhover-box"></div>').css({
                                opacity:0,
                                left:(boxWidth*cols)+'px',
                                top:(boxHeight*rows)+'px',
                                width:boxWidth+'px',
                                height:boxHeight+'px',
                                background: 'url("'+ element.children('img').attr('src') +'") no-repeat -'+ ((boxWidth + (cols * boxWidth)) - boxWidth) +'px -'+ ((boxHeight + (rows * boxHeight)) - boxHeight) +'px'
                            })
                            );
                    }
                }
            }
        }
        // Shuffle an array
        function shuffle(arr){
            for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
            return arr;
        }
        // Grayscale w canvas method
        function grayscale(src){
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var objGambar = new Image();
            objGambar.src = src;
            canvas.width = objGambar.width;
            canvas.height = objGambar.height;
            ctx.drawImage(objGambar, 0, 0);
            var pixelGambar = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for(var y = 0; y < pixelGambar.height; y++){
                for(var x = 0; x < pixelGambar.width; x++){
                    var i = (y * 4) * pixelGambar.width + x * 4;
                    var avg = (pixelGambar.data[i] + pixelGambar.data[i + 1] + pixelGambar.data[i + 2]) / 3;
                    pixelGambar.data[i] = avg;
                    pixelGambar.data[i + 1] = avg;
                    pixelGambar.data[i + 2] = avg;
                }
            }
            ctx.putImageData(pixelGambar, 0, 0, 0, 0, pixelGambar.width, pixelGambar.height);
            return canvas.toDataURL();
        }
    };
    $.fn._reverse = [].reverse;
})(jQuery);

