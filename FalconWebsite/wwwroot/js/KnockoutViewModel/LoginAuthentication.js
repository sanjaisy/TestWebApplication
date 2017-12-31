var LoginAuthentication = {
    IsSuccess: ko.observable(true),
    IsBtnShow: ko.observable(false),
    loginErrorCode: ko.observable(),
    UserName: ko.observable(),
    Password: ko.observable(),
    FirstName: ko.observable(),
    LastName: ko.observable(),
    Phone: ko.observable(),

    GetLoginAuthentication: function () {
        var self = this;
        if ($("#loginAuthentication").valid()) {
            var ajaxUrl = ApplicationRootUrl("Authentication", "Account");
            var UserViewModel = {
                UserName: self.UserName(),
                Password: self.Password()
            };
            self.IsBtnShow(true);
            self.IsSuccess(false);
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: ajaxUrl,
                dataType: "json",
                data: ko.toJSON(UserViewModel),
                success: function (data) {
                    if (data.isSuccess) {
                        self.IsSuccess(true);
                        self.loginErrorCode(data.message);
                        self.IsBtnShow(false);
                        if (data.data != null) {
                            if (data.data.userType) {
                                window.location.href = ApplicationRootUrl("Index", "Admin/Admin");
                                //} else {
                                //    window.location.href = ApplicationRootUrl("Index", "Order");
                            }
                        }

                    } else {
                        self.IsSuccess(true);
                        self.loginErrorCode(data.message);
                        self.IsBtnShow(false);
                    }
                },
                error: function (err) {

                }

            });

        }
    },

    RegisterUserClick: function () {
        var self = this;
        if ($("#signupform").valid()) {
            var ajaxUrl = ApplicationRootUrl("Registration", "Account");
            var registrationModel = {
                UserName: self.UserName(),
                Password: self.Password(),
                FirstName: self.FirstName(),
                LastName: self.LastName(),
                Phone: self.Phone()
            };
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: ajaxUrl,
                dataType: "json",
                data: ko.toJSON(registrationModel),
                success: function (data) {
                    if (data.isSuccess) {
                    }
                },
                error: function (err) {

                }

            });

        }

    }
};
$("#loginAuthentication").validate({
    rules: {
        email: {
            required: true
        },
        password: {
            required: true
        }
    },

    messages: {
        email: {
            required: "Please Enter Email",
            uniqueUserName: "This Username is taken already"
        },
        password: {
            required: "Please Enter Password"
        }

    },

    highlight: function (element) {
        $(element).closest('div').removeClass('has-success').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('div').removeClass('has-error').addClass('has-success');
    }
});


$("#signupform").validate({
    rules: {
        email: {
            required: true,
            email: true,
            remote: function () {
                LoginAuthentication.IsBtnShow(true);
                var r = {
                    
                    url: ApplicationRootUrl("UserExists", "Account"),
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: "{'UserName': '" + $('#email').val() + "'}",
                    dataFilter: function (data) {
                        LoginAuthentication.IsBtnShow(false);
                        return (JSON.parse(data));

                    }
                }
                return r;
            }
        },
        firstname: {
            required: true
        },
        lastname: {
            required: true
        },
        phone: {
            required: true,
            minlength: 12,
            maxlength: 12

        },
        password: {
            required: true,
            minlength: 5
        },
        confirmpassword: {
            required: true,
            equalTo: "#password",
            minlength: 5
        }
    },

    messages: {
        email: {
            required: "Please Enter Email or User Name !!",
            remote: "User Already Exists !!"
        },
        firstname: {
            required: "Please Enter First Name !!"
        },
        lastname: {
            required: "Please Enter Last Name !!"
        },
        phone: {
            required: "Please Enter Phone !!",
            digits: "Please enter Digits Only !!",
            minlength: "Phone Number is 10 Digits !!",
            maxlength: "Cannot Exceed more than 10 Digits !!"

        },
        password: {
            required: "Please Enter Password",
            minlength: "Please enter 5 or more character !!"
        },
        confirmpassword: {
            required: "Please Enter Confirm Password",
            minlength: "Please enter 5 or more character !!",
            equalTo: "Password Not Matched !!"
        }

    },

    highlight: function (element) {
        $(element).closest('div').removeClass('has-success').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('div').removeClass('has-error').addClass('has-success');
    }
});

$(document).ready(function() {
  
    ko.applyBindings(LoginAuthentication, document.getElementById("loginRegAuth"));
    $("#phonenumber").mask("999-999-9999");
});