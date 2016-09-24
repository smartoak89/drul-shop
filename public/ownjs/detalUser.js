(function() {
    'use strict';
    // edit rule
    $( document ).on( 'click', '#edit-detailUser, #hideEditUserInfo', function(e){
        e.preventDefault();
        $( '#editUserInfoContainer' ).toggleClass( 'hide' );
        // get data selecter row
        //getDataSelected();
    })
    .on( 'submit', '#formEditUserInfo', function(e){
        //e.preventDefault();
        //
        //var $this = $( this ),
        //    datas = $this.serializeArray(); // or use $this.serialize()
        //
        //// do server action to save change here ( ajax )
        //// ...
        //// just simple rule after ajax is done to demo
        //$.each( datas, function( i, data ){
        //    console.log( data.name + ' = ' + data.value );
        //});
        //
        //// change data selected row datatables
        //// get data from selected row
        //var dataSelected = datatables1.$( 'tr.active' ),
        //    node = getSelectedNode( datatables1 ),
        //    dataUpdate = [ datas[1].value, datas[2].value, datas[3].value, datas[4].value, datas[5].value ];
        //
        //dataSelected.data( 'id', datas[0].value );
        //datatables1.fnUpdate( dataUpdate, node );
        //
        //// keep display on changed row
        //datatables1.fnDisplayRow( node );

        // hide form edit
        $( '#editUserInfoContainer' ).addClass( 'hide' );
    });
});
