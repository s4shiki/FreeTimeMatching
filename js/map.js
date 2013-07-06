// マップオブジェクトを作成し、マーカーを表示
function initialize(){
	var myLatLng = geoLocate(); // MAPの初期位置
	
	if (myLatLng == null){ // 位置情報取得に失敗した場合、東京駅をセンターにしてMAP表示
		myLatLng = new google.maps.LatLng(35.681382, 139.766084);
	}
	var mapOptions = {
		center: myLatLng,
		zoom:11,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
	// 現在地のマーカー表示
	var marker = new google.maps.Marker({
		map:map,
		draggable:false,
		animation: google.maps.Animation.DROP,
		position: myLatLng,
		title: "現在地"
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
}
google.maps.event.addDomListener(window, 'load', initialize); // Windowがロードされたとき表示させる

// 現在地取得
function geoLocate(){
	// 位置情報取得のオプション。高精度にする
	var position_options = {
		enableHightAccuracy: true
	};
	// 現在地取得（変わる毎に更新）
	navigator.geolocation.watchPosition(success, fatal, position_options);
	
	//位置情報取得成功時
	function success(position){
		var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		return myLatLng;
	}
	
	// 位置情報取得失敗時
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
		return null;
	}
}