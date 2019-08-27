$( function () {
    $("#submit").on("click", function () {

      $('#shopList').empty();
      $('#shopList').append('<li class="mt-5 text-center">情報取得中....</li>');
      if( navigator.geolocation )
      {
        navigator.geolocation.getCurrentPosition(function(position){
          pos = position.coords;
          ajax(pos.latitude, pos.longitude)
        })
      }
    })

    function ajax(lat,land){
      // 初期化
      let location = '';
      let freeword = '';

      // 現在地が取れれば
      if(lat != null && land != null) location = '&latitude='+lat+'&longitude='+land+'&range=5';
      if($("#key").val() !== '') freeword = '&freeword=' + $("#key").val();

      let url = "https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=9ad2795a1a35166edd64a7ac39c6b131" + location + freeword;

      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json'
      })
      .then((...args) => { // done
        const [data, textStatus, jqXHR] = args;
        setTags(data.rest);
      })
      .catch((...args) => {
        const [jqXHR, textStatus, errorThrown] = args;
        $('#shopList').empty();
        $('#shopList').append('<li class="mt-5 text-center">情報の取得に失敗しました。</li>');
      });
    }

    function setTags(shops){
      $('#shopList').empty();
      console.log(shops);
      let map = 'https://www.google.com/maps/';
      if(shops == undefined) {
        $('#shopList').append('<li class="mt-5 text-center">お探しのページはありません</li>');
      } else {
        for(item of shops){
        if(item == null) break

        // ラッパー
        const listItem = $('<li class="border shadow-sm p-3 rounded-lg mb-3">');

        // 大枠
        const main = $('<div class="mb-3 row">');
        const sub = $('<dl class="mb-3 row">');
        const bottom = $('<div class="row">');

        // メイン内のタグ
        const left = $('<div class="col-md-4 mb-2">');
        const right = $('<div class="col-md-8">');

        // お店のPR
        const pr = '<p>' + item.pr.pr_short + '</p>';
        // お店の名前
        const shopname = '<h2>' + item.name + '</h2>';

        // 電話番号
        const tell = '<div class="col-md-6 mb-2"><a href="tel:'+item.tel+'" class="btn btn-success btn-block btn-lg"><i class="fas fa-phone-volume"></i> ' + item.tel + '</a></div>';

        // オープン時間
        const opentime = '<dt class="col-md-3">オープン時間</dt><dd class="col-md-9">' + item.opentime + '</dd>';

        // 店休日
        const holiday = '<dt class="col-md-3">店休日</dt><dd class="col-md-9">' + item.holiday + '</dd>';
        
        // 住所
        const location = '<dt class="col-md-3">住所</dt><dd class="col-md-9">' + item.address + '</dd>';
        
        // Google Mapへ飛ぶ
        let mapLink = map + '?q=' + item.address;
        mapLink = '<div class="col-md-6"><a href="' + mapLink + '" target="_blank" class="btn btn-warning btn-block  btn-lg"><i class="fas fa-map-marker-alt"></i> MAP</a></div>';

        // サムネイル
        const thumbnail = setImgTag(item.image_url, item.name);

        // main内のタグ追加処理
        left.append(thumbnail);
        right.append(shopname + pr);
        main.append(left);
        main.append(right);

        // お店の詳細情報追加
        sub.append(location +opentime + holiday);
        
        // リンク追加
        bottom.append(tell + mapLink);

        // 全てのタグを追加
        listItem.append(main);
        listItem.append(sub);
        listItem.append(bottom);
        $('#shopList').append(listItem);
      }
    }
    
  }

  // 画像のタグ作成
  function setImgTag(srcs,alt) {
    let src;
    for(let item in srcs){
      if(srcs[item] !== ''){
        src = srcs[item];
        break;
      }
    }
    if(src == null) src = 'https://placehold.jp/150x150.png';
    return '<img src="'+src+'" width="150" height="150" alt="'+alt+'">';
  }
});
