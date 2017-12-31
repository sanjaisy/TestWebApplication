
var itemColorViewModel = {
    pageNumber: ko.observable(1),
    currentPage: ko.observable(),
    Success: ko.observable(false),
    Error: ko.observable(false),
    pagination: ko.observableArray(),

    colorCode: ko.observable("#00000"),
    colorName: ko.observable('Black'),
    colorId: ko.observable(),
    addedOn: ko.observable(),
    addedBy: ko.observable({
        id: ko.observable()
    }),
    responseData: ko.observableArray(),
    errorMessage: ko.observable(false),
    ClickId: ko.observable(),

    getColorList: function () {
        var self = this;
        var ajaxUrl = ApplicationRootUrl("GetColorList", "Category") + "/" + self.pageNumber();
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
                itemColorViewModel.displayAlert(self.errorMessage(), self.Success());
                self.currentPage(data.currentPage);
                itemColorViewModel.displaySetting(data.totalPage);
                $('#LoadingImage').hide();
            },
            error: function (err) {

            }

        });
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
        itemColorViewModel.pageNumber(event.target.id);
        itemColorViewModel.getColorList();
    },
    displaySetting: function (totalPage) {
        itemColorViewModel.pagination([]);
        for (var i = 1; i <= totalPage; i++) {
            itemColorViewModel.pagination.push({ id: i, pageNo: i });
        };
        setTimeout(function () {
            itemColorViewModel.Success(false);
            itemColorViewModel.Error(false);
        }, 4000);
    },
    addColor: function () {
        if ($("#formItemColor").valid()) {
            var self = this;
            $('#LoadingImage').show();
            var colorModel = {
                ColorCode: self.colorCode(),
                ColorName: self.colorName(),
                Id: self.colorId(),
                AddedOn: self.addedOn(),
                AddedBy: self.addedBy()
            };
            var ajaxUrl = ApplicationRootUrl("AddEditColors", "Category");
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: ajaxUrl,
                dataType: "json",
                data: ko.toJSON(colorModel),
                success: function (data) {
                    if (data.isSuccess) {
                        self.errorMessage(data.message);
                        self.responseData(data.data.colorList);
                        self.Success(data.isSuccess);
                        $("#addEditColor").text("Add");
                        self.colorId(0),
                        self.addedBy({ id: ko.observable()});
                        if (data.data.isExists) {
                            self.Success(false);
                        }
                    } else {
                        self.errorMessage(data.message);
                    }
                    itemColorViewModel.displayAlert(self.errorMessage(), self.Success());
                    $('#LoadingImage').hide();
                },
                error: function (err) {

                }

            });
        }
    },
    editColorById: function (data, event) {
        var self = this;
        $('#LoadingImage').show();
        itemColorViewModel.ClickId(event.target.id);
        var ajaxUrl = ApplicationRootUrl("GetColorById", "Category") + "/" + itemColorViewModel.ClickId();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: ajaxUrl,
            dataType: "json",
            success: function (data) {
                if (data.isSuccess) {
                    itemColorViewModel.errorMessage(data.successMessage);
                    itemColorViewModel.colorId(data.data.id);
                    itemColorViewModel.addedOn(data.data.addedOn);
                    $("#addEditColor").text("Update");
                    itemColorViewModel.colorName(data.data.colorName);
                    itemColorViewModel.colorCode(data.data.colorCode);
                    itemColorViewModel.addedBy(data.data.addedBy)
                } else {
                    itemColorViewModel.errorMessage(data.message);
                }
                itemColorViewModel.Success(data.isSuccess);
                itemColorViewModel.displayAlert(itemColorViewModel.errorMessage(), itemColorViewModel.Success());
                $('#LoadingImage').hide();
            },
            error: function (err) {

            }

        });
    },
    DeleteColor: function (data, event) {
        itemColorViewModel.ClickId(event.target.id);
        $(".popover-top").popover({ placement: 'top' });
        //$('#deleteColors').modal('toggle');
    }
    
};

$("#formItemColor").validate({
    rules: {
        colorCode: {
            required: true
        }
    },

    messages: {
        colorCode: {
            required: "Please enter or select the color !!"
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
    ko.applyBindings(itemColorViewModel, document.getElementById("_partialColoritems"));
    itemColorViewModel.getColorList();
    $(function () {
        $('#cp2').colorpicker({
            customClass: 'colorpicker-2x',
            sliders: {
                saturation: {
                    maxLeft: 200,
                    maxTop: 200
                },
                hue: {
                    maxTop: 200
                },
                alpha: {
                    maxTop: 200
                }
            }
        }).on('changeColor',
            function (event) {
                itemColorViewModel.colorName(window.classifier.classify(itemColorViewModel.colorCode()));
            });
    });

    ko.bindingHandlers.popover = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor());
            var defaultOptions = { placement: 'top' };

            options = $.extend(true, {}, defaultOptions, options);

            var htmlContent = '';
            var containerId;
            if (options.contentHtmlId) {

                containerId = 'popoverHtml-' + options.contentHtmlId;
                htmlContent = "<div id='" + containerId + "'>" + $("#" + options.contentHtmlId).html() + "</div>";
                options.content = htmlContent;
            }

            $(element).popover(options);

            ko.utils.registerEventHandler(element, "click", function () {

                if (options.contentHtmlId) {
                    var thePopover = document.getElementById(containerId);

                    if (thePopover)
                        ko.applyBindings(viewModel, thePopover);
                }
                $('button[data-popoverclose]').click(function () {
                    $(element).popover('hide');
                });

                $('button[data-popoverOptionYes').click(function () {
                    $('#LoadingImagedeleteCol').show();
                    var ajaxUrl = ApplicationRootUrl("DeleteColor", "Category") + "/" + itemColorViewModel.ClickId();
                    $.ajax({
                        type: "DELETE",
                        contentType: "application/json; charset=utf-8",
                        url: ajaxUrl,
                        dataType: "json",
                        success: function (data) {
                            if (data.isSuccess) {
                                itemColorViewModel.responseData(data.data);
                                itemColorViewModel.Success(data.isSuccess);
                                itemColorViewModel.errorMessage(data.successMessage);
                            } else {
                                itemColorViewModel.Error(true);
                                itemColorViewModel.errorMessage(data.message);
                            }
                            $(element).popover('hide');
                            $('#LoadingImagedeleteCol').hide();
                            itemColorViewModel.currentPage(data.currentPage);
                            itemColorViewModel.displaySetting(data.totalPage);
                            itemColorViewModel.displayAlert(itemColorViewModel.errorMessage(), itemColorViewModel.Success());

                        },
                        error: function (err) {

                        }

                    });
                });


            });
        }
    };


});