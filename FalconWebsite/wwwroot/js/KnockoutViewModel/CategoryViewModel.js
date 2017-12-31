var CategoryViewModel = {
    pageNumber: ko.observable(1),
    Success: ko.observable(false),
    Error: ko.observable(false),
    EditError: ko.observable(false),
    message: ko.observable(),
    responseData: ko.observableArray(),
    pagination: ko.observableArray(),
    currentPage: ko.observable(),
    ClickId: ko.observable(),

    categoryId: ko.observable(),
    categoryName: ko.observable(),
    active: ko.observable(false),
    addedBy: ko.observable({
        active: ko.observable(),
        updatedDate: ko.observable(),
        updatedBy: ko.observable(),
        addedDate: ko.observable()
    }),
    addedDate: ko.observable(),


    CategoryAddButton: function () {
        CategoryViewModel.categoryId();
        CategoryViewModel.categoryName('');
        CategoryViewModel.active(false);
        $('#addCategoryModel').modal('toggle');
    },

    getCategoryList: function () {
        var self = this;
        $('#LoadingImage').show();
        var ajaxUrl = ApplicationRootUrl("GetCategoryList", "Category") + "/" + self.pageNumber();
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
                CategoryViewModel.displaySetting(data.totalPage);
            },
            error: function (err) {

            }

        });
    },

    paginationClick: function (data, event) {
        CategoryViewModel.pageNumber(event.target.id);
        CategoryViewModel.getCategoryList();
    },
    GetCategoryById: function (data, event) {
        $('#LoadingImageAddEditCat').show();
        CategoryViewModel.ClickId(event.target.id);
        $('#addCategoryModel').modal('toggle');
        var ajaxUrl = ApplicationRootUrl("GetCategoryById", "Category") + "/" + CategoryViewModel.ClickId();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: ajaxUrl,
            dataType: "json",
            success: function (data) {
                if (data.isSuccess) {
                    CategoryViewModel.categoryId(data.data.categoryId);
                    CategoryViewModel.categoryName(data.data.categoryName);
                    CategoryViewModel.active(data.data.active);
                    CategoryViewModel.addedBy(data.data.addedBy);
                    CategoryViewModel.message(data.successMessage);
                    CategoryViewModel.addedDate(data.data.addedDate);
                } else {
                    CategoryViewModel.EditError(true);
                    CategoryViewModel.message(data.successMessage);
                }
                $('#LoadingImageAddEditCat').hide();
            },
            error: function (err) {

            }

        });


    },
    DeleteCategory: function (data, event) {
        CategoryViewModel.ClickId(event.target.id);
        $('#DeleteCategory').modal('toggle');
    },
    confirmDeleteCategory: function () {
        var self = this;
        $('#LoadingImagedeleteCat').show();
        var ajaxUrl = ApplicationRootUrl("DeleteCategory", "Category") + "/" + CategoryViewModel.ClickId();
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
                $('#DeleteCategory').modal('toggle');
                $('#LoadingImagedeleteCat').hide();
                self.currentPage(data.currentPage);
                CategoryViewModel.displaySetting(data.totalPage);
            },
            error: function (err) {

            }

        });
    },
    AddEditCategory: function () {
        var self = this;

        var categoryModel = {
            categoryId: CategoryViewModel.categoryId(),
            categoryName: CategoryViewModel.categoryName(),
            active: CategoryViewModel.active(),
            addedBy: CategoryViewModel.addedBy(),
            addedDate: CategoryViewModel.addedDate()
        }
        if ($("#CategoryValidation").valid()) {
            $('#LoadingImageAddEditCat').show();
            var ajaxUrl = ApplicationRootUrl("AddEditCategory", "Category");
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: ajaxUrl,
                dataType: "json",
                data: ko.toJSON(categoryModel),
                success: function (data) {
                    $('#addCategoryModel').modal('toggle');
                    if (data.isSuccess) {
                        self.responseData(data.data);
                        self.Success(data.isSuccess);
                        self.message(data.successMessage);
                    } else {
                        self.Error(true);
                        self.message(data.successMessage);
                    }
                    $('#LoadingImageAddEditCat').hide();
                    self.currentPage(data.currentPage);
                    CategoryViewModel.displaySetting(data.totalPage);

                },
                error: function (err) {

                }

            });

        }
    },

    displaySetting: function (totalPage) {
        CategoryViewModel.pagination([]);
        for (var i = 1; i <= totalPage; i++) {
            CategoryViewModel.pagination.push({ id: i, pageNo: i });
        };
        setTimeout(function () {
            CategoryViewModel.Success(false);
            CategoryViewModel.Error(false);
        }, 4000);
    }
};

$("#CategoryValidation").validate({
    rules: {
        CategoryName: {
            required: true
        }
    },

    messages: {
        CategoryName: {
            required: "Please Enter Category Name !!"
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
        after: ['options'],   /* KO 3.0 feature to ensure binding execution order */
        init: function (element, valueAccessor, allBindingsAccessor) {
            var $element = $(element);
            $element.addClass('selectpicker').selectpicker();

            var doRefresh = function () {
                $element.selectpicker('refresh');
            }, subscriptions = [];

            // KO 3 requires subscriptions instead of relying on this binding's update
            // function firing when any other binding on the element is updated.

            // Add them to a subscription array so we can remove them when KO
            // tears down the element.  Otherwise you will have a resource leak.
            var addSubscription = function (bindingKey) {
                var targetObs = allBindingsAccessor.get(bindingKey);

                if (targetObs && ko.isObservable(targetObs)) {
                    subscriptions.push(targetObs.subscribe(doRefresh));
                }
            };

            addSubscription('options');
            addSubscription('value');           // Single
            addSubscription('selectedOptions'); // Multiple

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                while (subscriptions.length) {
                    subscriptions.pop().dispose();
                }
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
        }
    };
    ko.applyBindings(CategoryViewModel, document.getElementById("categoryMain"));
    CategoryViewModel.getCategoryList();
});