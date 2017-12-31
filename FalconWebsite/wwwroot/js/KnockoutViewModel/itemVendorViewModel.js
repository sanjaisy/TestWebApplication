var itemVendorViewModel = {
    vendorName: ko.observable(),
    vendorDescription: ko.observable(),
    vendorUrl: ko.observable(),
    addedOn: ko.observable(),
    addedBy: ko.observable({
        id: ko.observable()
    }),
    pageNumber: ko.observable(1),
    currentPage: ko.observable(),
    Success: ko.observable(false),
    Error: ko.observable(false),
    pagination: ko.observableArray(),

    responseData: ko.observableArray(),
    errorMessage: ko.observable(false),
    getVenderList : function() {
        var self = this;
        var ajaxUrl = ApplicationRootUrl("GetVendorList", "Category") + "/" + self.pageNumber();
        $('#LoadingImage').show();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: ajaxUrl,
            dataType: "json",
            success: function (data) {
                if (data.isSuccess) {
                    self.errorMessage(data.message);
                    self.responseData(data.data);
                    self.Success(data.isSuccess);
                } else {
                    self.errorMessage(data.message);
                }
                itemVendorViewModel.displayAlert(self.errorMessage(), self.Success());
                self.currentPage(data.currentPage);
                itemVendorViewModel.displaySetting(data.totalPage);
                $('#LoadingImage').hide();
            },
            error: function (err) {

            }

        });
    },
    vendorAddClick: function () {
        if ($("#vendorCrud").valid()) {
            $('#LoadingImage').show();
            var self = this;
            var vendorModel = {
                VendorName: self.vendorName(),
                VendorDescription: self.vendorDescription(),
                VendorUrl: self.vendorUrl(),
                AddedOn: self.addedOn(),
                AddedBy: self.addedBy()
            };
            var ajaxUrl = ApplicationRootUrl("AddEditVendor", "Category");
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: ajaxUrl,
                dataType: "json",
                data: ko.toJSON(vendorModel),
                success: function (data) {
                    if (data.isSuccess) {
                        self.errorMessage(data.message);
                        self.responseData(data.data.colorList);
                        self.Success(data.isSuccess);
                        self.addedBy({ id: ko.observable() });
                        if (data.data.isExists) {
                            self.Success(false);
                        }
                    } else {
                        self.errorMessage(data.message);
                    }
                    itemVendorViewModel.displayAlert(self.errorMessage(), self.Success());
                    $('#LoadingImage').hide();
                },
                error: function (err) {

                }

            });
        }
    },
    displayAlert: function (msg, sucess) {
        var dom = "";
        if (sucess) {
            dom = '<div class="top-alert"><div class="alert alert-success alert-dismissible fade in " role="alert"><i class="glyphicon glyphicon-ok"></i> ' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div></div>';
        }
        else {
            dom = '<div class="top-alert"><div class="alert alert-danger alert-dismissible fade in " role="alert"><i class="glyphicon glyphicon-exclamation-sign"></i> ' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div></div>';
        }
        var jdom = $(dom);
        jdom.hide();
        $("#colorFullModalDialog").append(jdom);
        jdom.fadeIn();
        setTimeout(function () {
            jdom.fadeOut(function () {
                jdom.remove();
            });
        }, 6000);

    },
    paginationClick: function (data, event) {
        itemVendorViewModel.pageNumber(event.target.id);
        itemVendorViewModel.getVenderList();
    },
    displaySetting: function (totalPage) {
        itemVendorViewModel.pagination([]);
        for (var i = 1; i <= totalPage; i++) {
            itemVendorViewModel.pagination.push({ id: i, pageNo: i });
        };
        setTimeout(function () {
            itemVendorViewModel.Success(false);
            itemVendorViewModel.Error(false);
        }, 4000);
    }
}

$("#vendorCrud").validate({
    rules: {
        vendorname: {
            required: true
        },
        vendorDesc: {
            required: true
        },
        vendorUrl: {
            required: true
        }

    },

    messages: {
        vendorname: {
            required: "Please enter vendor name !!"
        },
        vendorDesc: {
            required: "Please enter vendor Description !!"
        },
        vendorUrl: {
            required: "Please enter vendor url !!"
        }

    },

    highlight: function (element) {
        $(element).closest('div').removeClass('has-success').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('div').removeClass('has-error').addClass('has-success');
    }
});
$(document).ready(function () {
    ko.applyBindings(itemVendorViewModel, document.getElementById("_partialVendorItems"));
    itemVendorViewModel.getVenderList();
});