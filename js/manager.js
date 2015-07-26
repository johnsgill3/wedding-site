'use strict';
/*global define:false*/
define([
    'jquery',
    'filedrop'
],function($){
    console.log('managerjs started');
    $('#registry-manager').on('click','input[name="Delete"]',function(e){
        $.ajax('/manager',{
            type:'DELETE',
            data: {'_id':$(e.currentTarget).data('id')},
            success: function(data){
                console.log(arguments);
                if(!data.err && data.count){
                    var $t = $(e.currentTarget).parent().parent();
                    $t.fadeOut('fast',function(){$t.remove();});
                }
            },
            error: function(jqxhr,status,error){
                console.log(arguments);
            }
        });
    });
    $('#manage input[value="New"]').on('click',function(e){
        $('#manage table').append($('<tr><td><input type="text" name="name" placeholder="name" style="width:150px;" /></td>'+
        '<td><input type="text" name="desc" placeholder="description" /></td>'+
        '<td><input type="text" name="price" placeholder="price" /></td>'+
        '<td><input type="button" class="btn" value="Save" /></td><td><input type="button" class="btn" value="Cancel" /></td></tr>').hide().fadeIn());
    });
    $('#registry-manager').on('click','input[value="Save"]',function(e){
        //save now...
        //e.preventDefault();
        var $t = $(e.currentTarget).parent().parent();
        $t.fadeOut('fast',function(){$t.remove();});
    });
    $('#registry-manager').on('click','input[value="Cancel"]',function(e){
        console.log('cancel clicked');
        var $t = $(e.currentTarget).parent().parent();
        $t.fadeOut('fast',function(){$t.remove();});
    });
    $('#registry-manager').on('click','input[name="delete-image"]',function(e){
        e.preventDefault();
        $.ajax('/manager',{
            type:'DELETE',
            data: {'_id':$(e.currentTarget).data('id'),member:'img'},
            success: function(data){
                console.log(arguments);
                if(!data.err && data.count){
                    var $t = $(e.currentTarget).parent();
                    $t.html('No Image');
                }
            },
            error: function(jqhxr, status, error){
                console.log(arguments);
            }
        });
    });
    $('#registry-manager').on('dblclick','tr.editable',function(e){
        console.log('dblclick called for tr editable');
        var $tr = $(e.currentTarget),
        $name = $tr.children('td:first'),
        $desc = $tr.children('td:nth-child(2)'),
        $price = $tr.children('td:nth-child(3)');
        $name.data('name',$name.text());
        $desc.data('desc',$desc.text());
        $price.data('price',$price.text().replace('$',''));
        $name.html('<input type="text" name="name" value="'+$name.data('name')+'" style="width:150px;" />');
        $desc.html('<input type="text" name="name" value="'+$desc.data('desc')+'" />');
        $price.html('<input type="text" name="name" value="'+$price.data('price')+'" />');
        console.log($tr,$name,$desc,$price);
    });

    $('#photo-manager').on('click','input[type="checkbox"]',function(e){
      //update the visibility only
      var $tr = $(e.currentTarget).parent().parent(); //input > td > tr
      var $shown = $(e.currentTarget);
      if($tr.length && $shown.length){
        $.ajax('/manager/photo/'+$tr.data('id'),{
          type:'PUT',
          data:{newdata:{
            shown:$shown.is(':checked')
          }}
        }).then(function(data){
          console.log(arguments);
          if(data.error){
            $shown.prop('checked',!$shown.prop('checked'));
          }
        });
      }
    });
    $('#photo-manager').on('dblclick','tr.editable',function(e){
      console.log('dblclick called for tr photo editable');
      var $tr = $(e.currentTarget),
      $image = $tr.children('td:first'),
      $category = $tr.children('td:nth-child(2)'),
      $title = $tr.children('td:nth-child(3)'),
      $subtitle = $tr.children('td:nth-child(4)'),
      $path = $tr.children('td:nth-child(5)'),
      $pubpath = $tr.children('td:nth-child(6)'),
      $order = $tr.children('td:nth-child(7)'),
      $shown = $tr.children('td:nth-child(8)').find('input[type="checkbox"]');
      if($tr.children('td').last().find('input[name="save"]').length === 0){
        $category.data('category',$category.text());
        $category.html('<input style="width:100px;" type="text" name="category" value="'+$category.data('category')+'" />');
        $title.data('title',$title.text());
        $title.html('<input style="width:120px;" type="text" name="title" value="'+$title.data('title')+'" />');
        $subtitle.data('subtitle',$subtitle.text());
        $subtitle.html('<input style="width:100px;" type="text" name="subtitle" value="'+$subtitle.data('subtitle')+'" />');
        $order.data('order',$order.text());
        $order.html('<input style="width:30px;" type="number" name="order" value="'+$order.data('order')+'" />');
        $shown.data('shown',$shown.is(':checked'));
        //$shown.prop('disabled',false);
        $tr.append('<td><input type="button" name="save" value="Save" /> <input type="button" name="cancel" value="Cancel" /></td>');
        var restoreRow = function(photo){
          $category.text(photo?photo.category:$category.data('category'));
          $title.text(photo?photo.title:$title.data('title'));
          $subtitle.text(photo?photo.subtitle:$subtitle.data('subtitle'));
          $order.text(photo?photo.order:$order.data('order'));
          if(photo&&photo.shown){
            $shown.prop('checked',true);
          } else if(photo){
            $shown.prop('checked',false);
          } else if($shown.data('shown')) {
            $shown.prop('checked',true);
          } else {
            $shown.prop('checked',false);
          }
          //$shown.prop('disabled',true);
          $tr.children('td').last().remove();
          //finally, remove the event handler for the cancel button or we'll get multiple TDs removed as we go
          $tr.off('click');
        };
        $tr.on('click','input[name="save"]',function(e){
          //save the thing
          $.ajax('/manager/photo/'+$tr.data('id'),{
            type:'PUT',
            data:{newdata:{
              category:$category.find('input').val(),
              title:$title.find('input').val(),
              subtitle:$subtitle.find('input').val(),
              order:$order.find('input').val(),
              shown:$shown.is(':checked')
            }}
          }).then(function(data){
            console.log(arguments);
            if(data.error){
              //show error
              console.log(data);
            }else{
              //finally, restore the row
              restoreRow(data.photo);
            }
          });
        });
        $tr.on('click','input[name="cancel"]',function(e){
          //cancel editing
          restoreRow();
        });
      }
    });
    
    $('#manage').on('click','input[name="Upload"]',function(e){
        console.log('clicked on img upload button');
    });
    var regId, over = false;
    $('.fileDrop').text('Drop file here').filedrop({
        url : '/manager/upload',
        paramname: 'fileUpload',
        maxfilesize: 5,
        data: {
            id:function(){return regId;}
        },
        docOver: function(e){
            //console.log('docOver',e);
            if(!over){
                $('.fileDrop').css('border','1px dashed black');
            }
        },
        docLeave: function(e){
            //$('.fileDrop').css('border','1px dashed #000000');
            $('.fileDrop').css('border','none');
        },
        dragEnter: function(e){
            console.log(e);
            over = true;
            console.log($(e.currentTarget).data('id'));
            $(e.currentTarget).css('border', '2px dashed green');
        },
        dragLeave: function(e){
            //$('.fileDrop').css('border','2px dashed black');
            over = false;
        },
        drop: function(e){
            console.log('drop',e);
            regId = $(e.currentTarget).data('id');
            $('.fileDrop').css('border','none');
            over = false;
        },
        uploadStarted: function(i,file,len){
            console.log(arguments);
        },
        uploadFinished: function(i,file,response,time){
            console.log(arguments);
            if(response.imgPath && response.registry){
                $('tr[data-id="'+response.registry._id+'"] td.img').html('<img src="'+response.imgPath+'" style="width:100px;"><br><input type="button" class="btn btn-warning" data-id="'+response.registry._id+'" name="delete-image" value="Delete Image" />');
            }
        },
        progressUpdated: function(i,file,progress){
            
        },
        afterAll: function(e){
            console.log(arguments);
        }
    });
});
