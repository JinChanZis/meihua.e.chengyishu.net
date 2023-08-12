$(function() {

	// 所报数字
	var num = parseInt(getUrlParam("num"));
	if (!num) {
		var num = prompt("请报起卦数字：");
		if (!num || isNaN(num)) {
		    location.reload();
		} else {
			location.href = "?num=" + num;
		}
	}
	$('#num').html(num);

	// 地支序数
	var zhis = {
		"子":1, "丑":2, "寅":3, "卯":4, 
		"辰":5, "巳":6, "午":7, "未":8, 
		"申":9, "酉":10, "戌":11, "亥":12,
	};
	var zhisWuXing = {
		"子":"水", "丑":"土", "寅":"木", "卯":"木", 
		"辰":"土", "巳":"火", "午":"火", "未":"土", 
		"申":"金", "酉":"金", "戌":"土", "亥":"水",
	};
	// 年月日时
	var ymd = getUrlParam("ymd");
	var hm = getUrlParam("hm");
	var date = new Date(moment(ymd).format('YYYY/MM/DD') + " " + moment(hm).format('HH:mm'));
	if (!isValidDate(date)) {
		date = new Date();
		ymd = moment().format('YYYYMMDD');
		hm = moment().format('HHmm');
		location.href = "?num=" + num + "&ymd=" + ymd + "&hm=" + hm;
	}
	var now = Lunar.fromDate(date);
	// 年支序数
	var year = parseInt(zhis[now.getYearZhi()]);
	// 农历月数
	var month = parseInt(Math.abs(now.getMonth()));
	// 农历日数
	var day = parseInt(now.getDay());
	// 时支序数
	var time = parseInt(zhis[now.getTimeZhi()]);
	// 当前四柱
	var current = now.getYearZhi() + "年" + zhisWuXing[now.getYearZhi()];
	current += " <strong>" + now.getMonthZhi() + "月" + zhisWuXing[now.getMonthZhi()] + "</strong>";
	current += " " + now.getDayZhi() + "日" + zhisWuXing[now.getDayZhi()];
	current += " " + now.getTimeZhi() + "时" + zhisWuXing[now.getTimeZhi()];
	$('#current').html(current);
	
	// 先天八卦数
	var guas = {
		1:"乾", 2:"兑", 3:"离", 4:"震", 
		5:"巽", 6:"坎", 7:"艮", 8:"坤",
	};
	// 卦象
	var guasXiang = {
		"乾":"天", "兑":"泽", "离":"火", "震":"雷", 
		"巽":"风", "坎":"水", "艮":"山", "坤":"地",
	};
	// 卦五行
	var guasWuXing = {
		"乾":"金", "兑":"金", "离":"火", "震":"木", 
		"巽":"木", "坎":"水", "艮":"土", "坤":"土",
	};
	// 上卦
	var upGuaNum = (year+month+day+num)%8;
	if (upGuaNum == 0) {
		upGuaNum = 8;
	}
	var upGua = guas[upGuaNum];
	// 下卦
	var downGuaNum = (year+month+day+time+num)%8;
	if (downGuaNum == 0) {
		downGuaNum = 8;
	}
	var downGua = guas[downGuaNum];
	// 动爻
	var activeYaoNum = (year+month+day+time+num)%6;
	if (activeYaoNum == 0) {
		activeYaoNum = 6;
	}

	// 八卦各爻阴阳
	var yaos = {
		"乾":{1:"yang", 2:"yang", 3:"yang"}, 
		"兑":{1:"yang", 2:"yang", 3:"yin"}, 
		"离":{1:"yang", 2:"yin", 3:"yang"}, 
		"震":{1:"yang", 2:"yin", 3:"yin"}, 
		"巽":{1:"yin", 2:"yang", 3:"yang"}, 
		"坎":{1:"yin", 2:"yang", 3:"yin"}, 
		"艮":{1:"yin", 2:"yin", 3:"yang"}, 
		"坤":{1:"yin", 2:"yin", 3:"yin"},
	}
	// 本卦
	var benGua = [];
	benGua[1] = yaos[downGua][1];
	benGua[2] = yaos[downGua][2];
	benGua[3] = yaos[downGua][3];
	benGua[4] = yaos[upGua][1];
	benGua[5] = yaos[upGua][2];
	benGua[6] = yaos[upGua][3];
	// 互卦
	var huGua = [];
	huGua[1] = benGua[2];
	huGua[2] = benGua[3];
	huGua[3] = benGua[4];
	huGua[4] = benGua[3];
	huGua[5] = benGua[4];
	huGua[6] = benGua[5];
	// 变卦
	var bianGua = benGua.map((x) => x);
	if (bianGua[activeYaoNum] == "yin") {
		bianGua[activeYaoNum] = "yang";
	} else {
		bianGua[activeYaoNum] = "yin";
	}

	// 卦象五行
	var the8Guas = {		
		"yang":{
			"yang":{
				"yang":"乾",
				"yin":"兑",
			},
			"yin":{
				"yang":"离",
				"yin":"震",
			},
		},
		"yin":{
			"yang":{
				"yang":"巽",
				"yin":"坎",
			},
			"yin":{
				"yang":"艮",
				"yin":"坤",
			},
		},
	};
	// 本卦卦象五行
	var benUp = the8Guas[benGua[4]][benGua[5]][benGua[6]];
	var benUpGXWX = benUp + "（" + guasXiang[benUp] + "）" + guasWuXing[benUp];
	var benDown = the8Guas[benGua[1]][benGua[2]][benGua[3]];
	var benDownGXWX = benDown + "（" + guasXiang[benDown] + "）" + guasWuXing[benDown];
	$('#ben .card-body h5:nth-child(1)').html(benUpGXWX);
	$('#ben .card-body h5:nth-child(3)').html(benDownGXWX);
	// 互卦卦象五行
	var huUp = the8Guas[huGua[4]][huGua[5]][huGua[6]];
	var huUpGXWX = huUp + "（" + guasXiang[huUp] + "）" + guasWuXing[huUp];
	var huDown = the8Guas[huGua[1]][huGua[2]][huGua[3]];
	var huDownGXWX = huDown + "（" + guasXiang[huDown] + "）" + guasWuXing[huDown];
	$('#hu .card-body h5:nth-child(1)').html(huUpGXWX);
	$('#hu .card-body h5:nth-child(3)').html(huDownGXWX);
	// 变卦卦象五行
	var bianUp = the8Guas[bianGua[4]][bianGua[5]][bianGua[6]];
	var bianUpGXWX = bianUp + "（" + guasXiang[bianUp] + "）" + guasWuXing[bianUp];
	var bianDown = the8Guas[bianGua[1]][bianGua[2]][bianGua[3]];
	var bianDownGXWX = bianDown + "（" + guasXiang[bianDown] + "）" + guasWuXing[bianDown];
	$('#bian .card-body h5:nth-child(1)').html(bianUpGXWX);
	$('#bian .card-body h5:nth-child(3)').html(bianDownGXWX);

	// 六十四卦
	var the64Guas = {
		"天天":{"name":"乾", "pinyin":"qián"},
		"地地":{"name":"坤", "pinyin":"kūn"},
		"水雷":{"name":"屯", "pinyin":"zhūn"},
		"山水":{"name":"蒙", "pinyin":"méng"},
		"水天":{"name":"需", "pinyin":"xū"},
		"天水":{"name":"讼", "pinyin":"sòng"},
		"地水":{"name":"师", "pinyin":"shī"},
		"水地":{"name":"比", "pinyin":"bì"},
		"风天":{"name":"小畜", "pinyin":"xiao xù"},
		"天泽":{"name":"履", "pinyin":"lǚ"},
		"地天":{"name":"泰", "pinyin":"tài"},
		"天地":{"name":"否", "pinyin":"pǐ"},
		"天火":{"name":"同人", "pinyin":"tóng rén"},
		"火天":{"name":"大有", "pinyin":"dà yōu"},
		"地山":{"name":"谦", "pinyin":"qiān"},
		"雷地":{"name":"豫", "pinyin":"yǜ"},
		"泽雷":{"name":"随", "pinyin":"suí"},
		"山风":{"name":"蛊", "pinyin":"gǔ"},
		"地泽":{"name":"临", "pinyin":"lín"},
		"风地":{"name":"观", "pinyin":"guān"},
		"火雷":{"name":"噬嗑", "pinyin":"shì hé"},
		"山火":{"name":"贲", "pinyin":"bì"},
		"山地":{"name":"剥", "pinyin":"bō"},
		"地雷":{"name":"复", "pinyin":"fù"},
		"天雷":{"name":"无妄", "pinyin":"wú wàng"},
		"山天":{"name":"大畜", "pinyin":"dà xù"},
		"山雷":{"name":"颐", "pinyin":"yí"},
		"泽风":{"name":"大过", "pinyin":"dà guò"},
		"水水":{"name":"坎", "pinyin":"kǎn"},
		"火火":{"name":"离", "pinyin":"lí"},
		"泽山":{"name":"咸", "pinyin":"xián"},
		"雷风":{"name":"恒", "pinyin":"héng"},
		"天山":{"name":"遁", "pinyin":"dùn"},
		"雷天":{"name":"大壮", "pinyin":"dà zhuàng"},
		"火地":{"name":"晋", "pinyin":"jìn"},
		"地火":{"name":"明夷", "pinyin":"míng yí"},
		"风火":{"name":"家人", "pinyin":"jiā rén"},
		"火泽":{"name":"睽", "pinyin":"kuí"},
		"水山":{"name":"蹇", "pinyin":"jiǎn"},
		"雷水":{"name":"解", "pinyin":"xiè"},
		"山泽":{"name":"损", "pinyin":"sǔn"},
		"风雷":{"name":"益", "pinyin":"yì"},
		"泽天":{"name":"夬", "pinyin":"guài"},
		"天风":{"name":"姤", "pinyin":"gòu"},
		"泽地":{"name":"萃", "pinyin":"cuì"},
		"地风":{"name":"升", "pinyin":"shēng"},
		"泽水":{"name":"困", "pinyin":"kùn"},
		"水风":{"name":"井", "pinyin":"jǐng"},
		"泽火":{"name":"革", "pinyin":"gé"},
		"火风":{"name":"鼎", "pinyin":"dǐng"},
		"雷雷":{"name":"震", "pinyin":"zhèn"},
		"山山":{"name":"艮", "pinyin":"gèn"},
		"风山":{"name":"渐", "pinyin":"jiàn"},
		"雷泽":{"name":"归妹", "pinyin":"guī mèi"},
		"雷火":{"name":"丰", "pinyin":"fēng"},
		"火山":{"name":"旅", "pinyin":"lǚ"},
		"风风":{"name":"巽", "pinyin":"xùn"},
		"泽泽":{"name":"兑", "pinyin":"duì"},
		"风水":{"name":"涣", "pinyin":"huàn"},
		"水泽":{"name":"节", "pinyin":"jié"},
		"风泽":{"name":"中孚", "pinyin":"zhōng fú"},
		"雷山":{"name":"小过", "pinyin":"xiǎo guò"},
		"水火":{"name":"既济", "pinyin":"jì jì"},
		"火水":{"name":"未济", "pinyin":"wèi jì"},
	};
	// 本卦卦名
	var benName = the64Guas[guasXiang[benUp]+guasXiang[benDown]]['name'];
	var benPinyin = the64Guas[guasXiang[benUp]+guasXiang[benDown]]['pinyin'];
	$('#ben .card-body .title').html(benName);
	$('#ben .card-body .pinyin').html(benPinyin);
	// 互卦卦名
	var huName = the64Guas[guasXiang[huUp]+guasXiang[huDown]]['name'];
	var huPinyin = the64Guas[guasXiang[huUp]+guasXiang[huDown]]['pinyin'];
	$('#hu .card-body .title').html(huName);
	$('#hu .card-body .pinyin').html(huPinyin);
	// 变卦卦名
	var bianName = the64Guas[guasXiang[bianUp]+guasXiang[bianDown]]['name'];
	var bianPinyin = the64Guas[guasXiang[bianUp]+guasXiang[bianDown]]['pinyin'];
	$('#bian .card-body .title').html(bianName);
	$('#bian .card-body .pinyin').html(bianPinyin);

	// 画卦
	for (var i in benGua) {
	  	$('#ben li:nth-child('+(7-i)+')').addClass(benGua[i]);
	  	if (i == activeYaoNum) {
	  		$('#ben li:nth-child('+(7-i)+')').addClass(benGua[i]+'-active');
	  	}
	}
	for (var i in huGua) {
	  	$('#hu li:nth-child('+(7-i)+')').addClass(huGua[i]);
	}
	for (var i in bianGua) {
	  	$('#bian li:nth-child('+(7-i)+')').addClass(bianGua[i]);
	  	if (i == activeYaoNum) {
	  		$('#bian li:nth-child('+(7-i)+')').addClass(bianGua[i]+'-active');
	  	}
	}

	// 体用
	if (activeYaoNum > 3) {
		// 下体上用
		$('.ti').addClass('down');
		$('.yong').addClass('up');
	} else {
		// 上体下用
		$('.ti').addClass('up');
		$('.yong').addClass('down');
	}

	$('.d-none').removeClass('d-none');

});

function getUrlParam(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime())
}