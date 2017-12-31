
var SubCategoryViewModel = {
    pageNumber: ko.observable(1),
    responseData: ko.observableArray(),
    categoryResponseData: ko.observableArray(),
    pagination: ko.observableArray(),
    currentPage: ko.observable(),
    Success: ko.observable(false),
    catSuccess: ko.observable(false),
    Error: ko.observable(false),
    EditError: ko.observable(false),
    message: ko.observable(),
    addedBy: ko.observable({
        active: ko.observable(),
        updatedDate: ko.observable(),
        updatedBy: ko.observable(),
        addedDate: ko.observable()
    }),
    addedDate: ko.observable(),
    ClickId: ko.observable(),

    SubCategoryOneId: ko.observable(),
    SubCatOneName: ko.observable(),
    CategoryId: ko.observable(),
    active: ko.observable(false),

    selectCategory: ko.observable(),
    GetSubCategoryById: function (data, event) {
        var self = this;
        SubCategoryViewModel.ClickId(event.target.id);
        $('#addEditSubCategoryModel').modal('toggle');
        $('#LoadingImageAddEditsubCat').show();
        var ajaxUrl = ApplicationRootUrl("GetSubCategoryById", "Category") + "/" + SubCategoryViewModel.ClickId();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: ajaxUrl,
            dataType: "json",
            success: function (data) {
                if (data.isSuccess) {
                    SubCategoryViewModel.SubCategoryOneId(data.data.subCategoryOneId);
                    SubCategoryViewModel.SubCatOneName(data.data.subCatOneName);
                    SubCategoryViewModel.active(data.data.active);
                    SubCategoryViewModel.addedBy(data.data.addedBy);
                    SubCategoryViewModel.message(data.successMessage);
                    SubCategoryViewModel.addedDate(data.data.addedDate);
                    SubCategoryViewModel.categoryResponseData(data.data.listCategory);
                    SubCategoryViewModel.selectCategory(data.data.category.categoryId);
                    SubCategoryViewModel.catSuccess(data.isSuccess);
                    SubCategoryViewModel.message(data.successMessage);
                } else {
                    SubCategoryViewModel.EditError(true);
                    SubCategoryViewModel.message(data.successMessage);
                }
                $('#LoadingImageAddEditsubCat').hide();
                SubCategoryViewModel.displayErrorOrSuccess();
            },
            error: function (err) {

            }

        });
    },
    subCategoryAddButton: function () {
        var self = this;
        $('#addEditSubCategoryModel').modal('toggle');
        $('#LoadingImageAddEditsubCat').show();
        SubCategoryViewModel.SubCategoryOneId();
        SubCategoryViewModel.SubCatOneName('');
        SubCategoryViewModel.selectCategory('');
        SubCategoryViewModel.active(false);
        SubCategoryViewModel.addedBy('');
        SubCategoryViewModel.addedDate('');
        var ajaxUrl = ApplicationRootUrl("GetAllCategoryList", "Category");
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: ajaxUrl,
            dataType: "json",
            success: function (data) {
                if (data.isSuccess) {
                    self.categoryResponseData(data.data);
                    self.catSuccess(data.isSuccess);
                    self.message(data.successMessage);
                } else {
                    self.Error(true);
                    self.message(data.successMessage);
                }
                $('#LoadingImageAddEditsubCat').hide();
                SubCategoryViewModel.displayErrorOrSuccess();
            },
            error: function (err) {
                $('#LoadingImageAddEdit').hide();
            }


        });


    },
    DeleteSubCategory: function (data, event) {
        var self = this;
        SubCategoryViewModel.ClickId(event.target.id);
        $('#DeleteSubCategory').modal('toggle');
    },
    confirmDeleteSubCategory: function() {
        var self = this;
        $('#LoadingImagedeleteCat').show();
        var ajaxUrl = ApplicationRootUrl("DeleteSubCategory", "Category") + "/" + SubCategoryViewModel.ClickId();
        $.ajax({
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            url: ajaxUrl,
            dataType: "json",
            success: function (data) {
                if (data.isSuccess) {
                    self.responseData(data.data);
                    self.Success(data.isSuccess);
                    self.message(data.successMessage);
                } else {
                    self.Error(true);
                    self.message(data.successMessage);
                }
                $('#DeleteSubCategory').modal('toggle');
                $('#LoadingImagedeleteCat').hide();
                self.currentPage(data.currentPage);
                SubCategoryViewModel.displaySetting(data.totalPage);
            },
            error: function (err) {

            }

        });  
    },
    displayErrorOrSuccess : function() {
        setTimeout(function () {
            SubCategoryViewModel.catSuccess(false);
            SubCategoryViewModel.EditError(false);
        }, 2000);
    },

    AddEditSubCategory: function () {
        var self = this;
        var SubCategoryOneModel = {
            SubCategoryOneId: SubCategoryViewModel.SubCategoryOneId(),
            SubCatOneName: SubCategoryViewModel.SubCatOneName(),
            Category: { CategoryId: SubCategoryViewModel.selectCategory() },
            active: SubCategoryViewModel.active(),
            addedBy: SubCategoryViewModel.addedBy(),
            addedDate: SubCategoryViewModel.addedDate()
        }
        if ($("#SubCategoryOneValidation").valid()) {
            $('#LoadingImageAddEditsubCat').show();
            var ajaxUrl = ApplicationRootUrl("AddEditSubCategoryOne", "Category");
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: ajaxUrl,
                dataType: "json",
                data: ko.toJSON(SubCategoryOneModel),
                success: function (data) {
                    
                    if (data.isSuccess) {
                        self.responseData(data.data);
                        self.Success(data.isSuccess);
                        self.message(data.successMessage);
                        $('#addEditSubCategoryModel').modal('toggle');
                    } else {
                        self.EditError(true);
                        self.message(data.successMessage);
                    }
                    $('#LoadingImageAddEditCat').hide();
                    self.currentPage(data.currentPage);
                    self.displaySetting(data.totalPage);

                },
                error: function (err) {

                }

            });
        }
    },
    paginationClick: function (data, event) {
        SubCategoryViewModel.pageNumber(event.target.id);
        SubCategoryViewModel.getSubCategoryList();
    },
    getSubCategoryList: function() {
        var self = this;
        $('#LoadingImage').show();
        var ajaxUrl = ApplicationRootUrl("GetAllSubCategoryList", "Category") + "/" + self.pageNumber();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: ajaxUrl,
            dataType: "json",
            success: function (data) {
                if (data.isSuccess) {
                    self.responseData(data.data);
                    self.Success(data.isSuccess);
                    self.message(data.successMessage);
                } else {
                    self.Error(true);
                    self.message(data.successMessage);
                }
                $('#LoadingImage').hide();
                self.currentPage(data.currentPage);
                SubCategoryViewModel.displaySetting(data.totalPage);
            },
            error: function (err) {

            }

        });
    },
    displaySetting: function (totalPage) {
        SubCategoryViewModel.pagination([]);
        for (var i = 1; i <= totalPage; i++) {
            SubCategoryViewModel.pagination.push({ id: i, pageNo: i });
        };
        setTimeout(function () {
            SubCategoryViewModel.Success(false);
            SubCategoryViewModel.Error(false);
        }, 4000);
    }
};
$("#SubCategoryOneValidation").validate({
    rules: {
        SubCategoryoneName: {
            required: true
        },
        categoryName: {
            required: true
        }
    },

    messages: {
        SubCategoryoneName: {
            required: "Please Enter Sub Category Name !!"
        },
        categoryName: {
            required: "Please Select Category Name !!"
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
    ko.bindingHandlers.selectPicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            if ($(element).is('select')) {
                if (ko.isObservable(valueAccessor())) {
                    if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                        // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                        ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                    } else {
                        // regular select and observable so call the default value binding
                        ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                    }
                }
                $(element).addClass('selectpicker').selectpicker();
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            if ($(element).is('select')) {
                var isDisabled = ko.utils.unwrapObservable(allBindingsAccessor().disable);
                if (isDisabled) {
                    // the dropdown is disabled and we need to reset it to its first option
                    $(element).selectpicker('val', $(element).children('option:last').val());
                }
                // React to options changes
                ko.unwrap(allBindingsAccessor.get('options'));
                // React to value changes
                ko.unwrap(allBindingsAccessor.get('value'));
                // Wait a tick to refresh
                setTimeout(() => { $(element).selectpicker('refresh'); }, 0);
            }
        }
    };
    ko.bindingHandlers.bootstrapToggleOn = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            $elem = $(element);
            $(element).bootstrapToggle({
                on: 'Yes',
                off: 'No',
                onstyle: 'primary',
                offstyle: 'danger'
            });
            if (ko.utils.unwrapObservable(valueAccessor())) {
                $elem.bootstrapToggle('on');
            } else {
                $elem.bootstrapToggle('off');
            }

            $elem.change(function () {
                if ($(this).prop('checked')) {
                    valueAccessor()(true);
                } else {
                    valueAccessor()(false);
                }
            })

        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var vStatus = $(element).prop('checked');
            var vmStatus = ko.utils.unwrapObservable(valueAccessor());
            if (vStatus != vmStatus) {
                $(element).bootstrapToggle('toggle');
            }
        }
    };
    ko.applyBindings(SubCategoryViewModel, document.getElementById("subCategoryMain"));
    SubCategoryViewModel.getSubCategoryList();

});