var SubCategorytwoViewModel = {
    pageNumber: ko.observable(1),
    categoryResponseData: ko.observableArray(),
    subCategoryByCategoryId: ko.observableArray(),
    catSuccess: ko.observable(false),
    currentPage: ko.observable(),
    pagination: ko.observableArray(),
    responseData: ko.observableArray(),
    Success: ko.observable(false),
    Error: ko.observable(false),
    EditError: ko.observable(false),
    message: ko.observable(),
    addedBy: ko.observable(),
    addedDate: ko.observable(),
    pictureUrl: ko.observable(),
    ClickId: ko.observable(),

    subCatTwoName: ko.observable(),
    active: ko.observable(false),
    selectCategory: ko.observable(),
    selectCategoryOne: ko.observable(),
    CategoryId: ko.observable(),

    fileInput: ko.observable(),
    subCategorytwoAddButton: function () {
        var self = this;
        $('#addEditSubCategorytwoModel').modal('toggle');
        $('#LoadingImageAddEdit').show();
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
                $('#LoadingImageAddEdit').hide();
                SubCategorytwoViewModel.displayErrorOrSuccess();
            },
            error: function (err) {
                $('#LoadingImageAddEdit').hide();
            }


        });
    },
    getAllSubCategorytwo: function () {
        var self = this;
        $('#LoadingImage').show();
        var ajaxUrl = ApplicationRootUrl("GetSubCategoryLevelTwoList", "Category") + "/" + self.pageNumber();
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
                SubCategorytwoViewModel.displaySetting(data.totalPage);
            },
            error: function (err) {

            }

        });
    },
    GetSubCategoryById: function (data, event) {
        var self = this;
        SubCategorytwoViewModel.ClickId(event.target.id);
        $('#addEditSubCategorytwoModel').modal('toggle');
        $('#LoadingImageAddEdit').show();
        var ajaxUrl = ApplicationRootUrl("GetSubCategoryTwoById", "Category") + "/" + SubCategorytwoViewModel.ClickId();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: ajaxUrl,
            dataType: "json",
            success: function (data) {
                if (data.isSuccess) {
                    SubCategorytwoViewModel.CategoryId(data.data.id);
                    SubCategorytwoViewModel.categoryResponseData(data.data.subCatOne.listCategory);
                    SubCategorytwoViewModel.subCatTwoName(data.data.subCatTwoName);
                    SubCategorytwoViewModel.active(data.data.active);
                    SubCategorytwoViewModel.selectCategory(data.data.category.categoryId);
                    SubCategorytwoViewModel.Success(data.isSuccess);
                    SubCategorytwoViewModel.message(data.successMessage);
                    SubCategorytwoViewModel.addedBy(data.data.addedBy.id);
                    SubCategorytwoViewModel.addedDate(data.data.addedOn);
                    SubCategorytwoViewModel.pictureUrl(data.data.pictureUrl);
                    
                } else {
                    SubCategorytwoViewModel.Error(true);
                    SubCategorytwoViewModel.message(data.successMessage);
                }
                $('#LoadingImageAddEdit').hide();
                SubCategorytwoViewModel.currentPage(data.currentPage);
                SubCategorytwoViewModel.displaySetting(data.totalPage);
            },
            error: function (err) {

            }

        });
    },
    paginationClick: function (data, event) {
        SubCategorytwoViewModel.pageNumber(event.target.id);
        SubCategorytwoViewModel.getAllSubCategorytwo();
    },
    displaySetting: function (totalPage) {
        SubCategorytwoViewModel.pagination([]);
        for (var i = 1; i <= totalPage; i++) {
            SubCategorytwoViewModel.pagination.push({ id: i, pageNo: i });
        };
        setTimeout(function () {
            SubCategorytwoViewModel.Success(false);
            SubCategorytwoViewModel.Error(false);
        }, 4000);
    },
    AddEditSubCategorytwo: function () {
        var self = this;
        if ($("#SubCategorytwoValidation").valid()) {
            $('#LoadingImageAddEdit').show();
            var ajaxUrl = ApplicationRootUrl("AddEditSubCategoryTwo", "Category");
            var formData = new FormData();
            formData.append('id', SubCategorytwoViewModel.CategoryId());
            var totalFiles = document.getElementById("subCatFile").files.length;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("subCatFile").files[i];

                formData.append("File", file);
            }
            formData.append('SubCatTwoName', self.subCatTwoName());
            //var Category = {
            //    CategoryId: self.selectCategory()
            //};
            
            formData.append('TempCategoryId', self.selectCategory());
            formData.append('TempaddedBy', self.addedBy());
            formData.append('AddedOn', self.addedDate());
            formData.append('PictureUrl', self.pictureUrl());

            //var subCatOne= {
            //    SubCategoryOneId: self.selectCategorytwo()
            //};
            formData.append('TempSubCategoryOneId', self.selectCategoryOne());

            formData.append('Active', self.active());
           
            $.ajax({
                type: "POST",
                contentType: false,
                processData: false,
                url: ajaxUrl,
                data: formData,
                dataType: "json",
                success: function (data) {

                    if (data.isSuccess) {
                        self.responseData(data.data);
                        self.Success(data.isSuccess);
                        self.message(data.successMessage);
                        $('#addEditSubCategorytwoModel').modal('toggle');
                    } else {
                        self.EditError(true);
                        self.message(data.successMessage);
                    }
                    $('#LoadingImageAddEdit').hide();
                    self.currentPage(data.currentPage);
                    self.displaySetting(data.totalPage);

                },
                error: function (err) {

                }

            });
        }
    },
    displayErrorOrSuccess: function () {
        setTimeout(function () {
            SubCategorytwoViewModel.catSuccess(false);
            SubCategorytwoViewModel.EditError(false);
        }, 2000);
    },
    DeleteSubCategory: function (data, event) {
        var self = this;
        SubCategorytwoViewModel.ClickId(event.target.id);
        $('#DeleteSubCategory').modal('toggle');
    },
    confirmDeleteSubCategory: function() {
        var self = this;
        $('#LoadingImagedeleteCat').show();
        var ajaxUrl = ApplicationRootUrl("DeleteSubCategoryTwo", "Category") + "/" + SubCategorytwoViewModel.ClickId();
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
                SubCategorytwoViewModel.displaySetting(data.totalPage);
            },
            error: function (err) {

            }

        });  
    }
};
SubCategorytwoViewModel.selectCategory.subscribe(function (newValue) {
    $('#LoadingImageAddEdit').show();
    var ajaxUrl = ApplicationRootUrl("GetSubCategoryOneByCategoryId", "Category") + "/" + newValue;
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: ajaxUrl,
        dataType: "json",
        success: function (data) {
            if (data.isSuccess) {
                SubCategorytwoViewModel.subCategoryByCategoryId(data.data);
                SubCategorytwoViewModel.selectCategoryOne(data.data.length > 0 ? data.data[0].subCategoryOneId : null);
                SubCategorytwoViewModel.catSuccess(data.isSuccess);
                SubCategorytwoViewModel.message(data.successMessage);
            } else {
                SubCategorytwoViewModel.Error(true);
                SubCategorytwoViewModel.message(data.successMessage);
            }
            $('#LoadingImageAddEdit').hide();
            SubCategorytwoViewModel.displayErrorOrSuccess();
        },
        error: function (err) {
            $('#LoadingImageAddEdit').hide();
        }


    });
});

$("#SubCategorytwoValidation").validate({
    rules: {
        SubCategorytwoName: {
            required: true
        },
        SubCategoryoneName: {
            required: true
        },
        categoryName: {
            required: true
        },
        subCatFile: {
            extension: "jpg|gif|png"
        }
    },

    messages: {
        SubCategoryoneName: {
            required: "Please Enter Sub Category Name !!"
        },
        categoryName: {
            required: "Please Select Category Name !!"
        },
        SubCategorytwoName: {
            required: "Please Select Sub Category Name !!"
        },
        subCatFile: {
            extension: "Invalid File !!"
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
    ko.applyBindings(SubCategorytwoViewModel, document.getElementById("subCategorytwoMain"));
    SubCategorytwoViewModel.getAllSubCategorytwo();

    // Code for image Preview and load image
    $(document).on('click', '#close-preview', function () {
        $('.image-preview').popover('hide');
        // Hover befor close the preview
        $('.image-preview').hover(
            function () {
                $('.image-preview').popover('show');
            },
            function () {
                $('.image-preview').popover('hide');
            }
        );
    });

    $(function () {
        // Create the close button
        var closebtn = $('<button/>', {
            type: "button",
            text: 'x',
            id: 'close-preview',
            style: 'font-size: initial;',
        });
        closebtn.attr("class", "close pull-right");
        // Set the popover default content
        $('.image-preview').popover({
            trigger: 'manual',
            html: true,
            title: "<strong>Preview</strong>" + $(closebtn)[0].outerHTML,
            content: "There's no image",
            placement: 'bottom'
        });
        // Clear event
        $('.image-preview-clear').click(function () {
            $('.image-preview').attr("data-content", "").popover('hide');
            $('.image-preview-filename').val("");
            $('.image-preview-clear').hide();
            $('.image-preview-input input:file').val("");
            $(".image-preview-input-title").text("Browse");
        });
        // Create the preview image
        $(".image-preview-input input:file").change(function () {
            var img = $('<img/>', {
                id: 'dynamic',
                width: 250,
                height: 200
            });
            var file = this.files[0];
            var reader = new FileReader();
            // Set preview image into the popover data-content
            reader.onload = function (e) {
                $(".image-preview-input-title").text("Change");
                $(".image-preview-clear").show();
                $(".image-preview-filename").val(file.name);
                img.attr('src', e.target.result);
                $(".image-preview").attr("data-content", $(img)[0].outerHTML).popover("show");
            }
            reader.readAsDataURL(file);
        });
    });

});