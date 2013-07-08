var map; // マップ
var infowindow; // マーカーの詳細表示

google.maps.event.addDomListener(window, 'load', getLatLng); // Windowがロードされたとき表示させる

// 位置情報を取得
function getLatLng(){
	// 位置情報取得のオプション。高精度にする
	var position_options = {
		enableHightAccuracy: true
	};
	// 現在地取得（変わる毎に更新）成功時と失敗時でコールバック関数を呼ぶ
	navigator.geolocation.getCurrentPosition(success, fatal, position_options);
}

//位置情報取得成功時のコールバック関数
function success(position){
	var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	initialize(myLatLng); // マップオブジェクト作成関数呼び出し
}
	
// 位置情報取得失敗時のコールバック関数
function fatal(error){
	var message = "";

	switch(error.code){
		// 位置情報が取得出来ない場合
		case error.POSITION_UNAVAILABLE:
			message = "位置情報の取得ができませんでした。";
			break;
		// Geolocationの使用が許可されない場合
		case error.PERMISSION_DENIED:
			message = "位置情報取得の使用許可がされませんでした。";
			break;
		// タイムアウトした場合
		case error.PERMISSION_DENIED_TIMEOUT:
			message = "位置情報取得中にタイムアウトしました。";
			break;
	}
	window.alert(message);
	
	// 位置情報取得に失敗した場合、東京駅をセンターにしてMAP表示
	var myLatLng = new google.maps.LatLng(35.681382, 139.766084);
	
	initialize(myLatLng); // マップオブジェクト作成関数呼び出し
}

// マップオブジェクトを作成し、マーカーを表示
function initialize(myLatLng){
	var mapOptions = {
		center: myLatLng,
		zoom:11,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
	// ユーザのマーカーアイコンを変更
	var markerImage = new google.maps.MarkerImage(
		// 画像の場所
		"http://blog-imgs-44.fc2.com/p/c/r/pcrice/mark2.png",
		// マーカーのサイズ
		new google.maps.Size(20, 24),
		// 画像の基準位置
		new google.maps.Point(0, 0),
		// Anchorポイント
		new google.maps.Point(10, 24)
	);
	
	// 現在地のマーカー表示
	var marker = new google.maps.Marker({
		map:map,
		draggable:false,
		animation: google.maps.Animation.DROP,
		position: myLatLng,
		title: "現在地",
		icon: markerImage
	});
	
	// サークルオプションの設定
	var circleOptions = { 
		center: myLatLng, 
		map: map,
		radius: 10000, 
		strokeWeight: 3, 
		strokeColor: "#cd5c5c", 
		strokeOpacity: 0.5, 
		fillColor: "#e9967a", 
		fillOpacity: 0.5 
	}; 
	
	// サークル表示（半径10k）
	var circle = new google.maps.Circle(circleOptions); 
	
	// プレイス検索
	var request = {
		location: myLatLng,
		radius: '10000',
	};
	infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	service.search(request, callback);
}

// プレイス検索のコールバック関数
function callback(results, status){
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			createMarker(results[i]);
		}
	}
}

// プレイス検索のときに表示するマーカー
function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}