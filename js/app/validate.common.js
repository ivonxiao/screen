;(function($) {
	$.extend($.validator.messages, {
		required : "不能为空",
		remote : "请修正该字段",
		email : "无效的电子邮件",
		url : "不是合法的网址",
		date : "不是合法的日期",
		dateISO : "不是合法的日期 (ISO).",
		number : "不是合法的数字",
		digits : "只能输入整数",
		creditcard : "不是合法的信用卡号",
		equalTo : "请再次输入相同的值",
		accept : "请输入拥有合法后缀名的字符串",
		maxlength : $.validator.format("请输入一个长度最多是 {0} 的字符串"),
		minlength : $.validator.format("请输入一个长度最少是 {0} 的字符串"),
		rangelength : $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		range : $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max : $.validator.format("请输入一个最大为{0} 的值"),
		min : $.validator.format("请输入一个最小为{0} 的值")
	});
	$.validator.addMethod("mobile", function(value, element) {
		var tel = /^1\d{10}$/;
		return this.optional(element) || (tel.test(value));
	}, "请输入有效的手机号码");
	$.validator.addMethod("maxlength", function(value, element,param) {
		var len = $.trim(value).replace(/[^\x00-\xff]/g, '..').length;
		return this.optional(element) || (len <=param);
	}, "不能超过{0}个字节");
	$.validator.addMethod("password", function(value, element) {
		var reg = /^(?=.*\d)(?=.*[A-Za-z])[0-9a-zA-Z]/;
		return this.optional(element) || (reg.test(value));
	}, "必须包含数字和字母");
	$.validator.addMethod('selectRequired',function(value,element) {
		return !!value;
	},"必须选择一个下拉项");

	$.validator.setDefaults({
		errorClass: 'jk-valid-error',
		onfocusin: function(element) {
			
		},
		onfocusout: function(element) {
			if($(element).valid()) {
				$(element).tooltip('destroy').removeClass($.validator.defaults.errorClass);
			}
		},
		onkeyup: function(element) {
			if($(element).valid()) {
				$(element).tooltip('destroy').removeClass($.validator.defaults.errorClass);
			}
		},
		onclick: function(element) {
			if($(element).valid()) {
				if(element.type.toLowerCase() == 'radio' || element.type.toLowerCase() == 'checkbox') {
					$('[name =' + element.name + ']').tooltip('destroy').removeClass($.validator.defaults.errorClass);
					}
			}
		},
		showErrors: function(errorMap,errorList) {
			var errorClass = $.validator.defaults.errorClass;
			if(errorList.length) {
				$.each(errorList,function() {
					var $ele = $(this.element),
						tooltipId = $ele.attr('aria-describedby');
					$ele.addClass(errorClass);
					if(tooltipId) {
						$('#' + tooltipId).find('.tooltip-inner').text(this.message);
						return;
					}

					$ele.tooltip({
						trigger: 'manual',
						title: this.message,
						placement: function(tooltip,triggerNode) {
							return $(triggerNode).data('placement') || 'right';
						}
					}).tooltip('show');
				});
			}
		}
	});
})(jQuery);