<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */
    'required' => 'Trường :attribute là bắt buộc.',
    'string' => 'Trường :attribute phải là chuỗi ký tự.',
    'numeric' => 'Trường :attribute phải là số.',
    'integer' => 'Trường :attribute phải là số nguyên.',
    'max' => [
        'string' => 'Trường :attribute không được dài quá :max ký tự.',
        'numeric' => 'Trường :attribute không được lớn hơn :max.',
    ],
    'min' => [
        'numeric' => 'Trường :attribute phải lớn hơn hoặc bằng :min.',
    ],
    'unique' => 'Trường :attribute đã tồn tại.',
    'in' => 'Trường :attribute phải là một trong các giá trị: :values.',
    'exists' => 'Trường :attribute không tồn tại.',
    'date' => 'Trường :attribute phải là ngày hợp lệ.',
    'after_or_equal' => 'Trường :attribute phải từ ngày :date trở đi.',
    'before_or_equal' => 'Trường :attribute phải trước hoặc bằng ngày :date.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */
    'custom' => [
        // Quản lý sản phẩm
        'price' => [
            'required' => 'Giá sản phẩm là bắt buộc.',
            'numeric' => 'Giá sản phẩm phải là số.',
            'min' => 'Giá sản phẩm phải lớn hơn hoặc bằng :min.',
        ],
        'description' => [
            'required' => 'Mô tả sản phẩm là bắt buộc.',
        ],
        'category_id' => [
            'required' => 'Danh mục sản phẩm là bắt buộc.',
            'exists' => 'Danh mục sản phẩm không tồn tại.',
        ],
        // Quản lý biến thể màu sắc và dung lượng
        'value' => [
            'required' => 'Giá trị biến thể là bắt buộc.',
            'unique' => 'Giá trị biến thể đã tồn tại, vui lòng chọn giá trị khác.',
        ],
        // Quản lý sản phẩm biến thể
        'product_id' => [
            'required' => 'Sản phẩm là bắt buộc.',
            'exists' => 'Sản phẩm không tồn tại.',
        ],
        'color_id' => [
            'required' => 'Màu sắc là bắt buộc.',
            'exists' => 'Màu sắc không tồn tại.',
        ],
        'storage_id' => [
            'required' => 'Dung lượng là bắt buộc.',
            'exists' => 'Dung lượng không tồn tại.',
        ],
        'stock' => [
            'required' => 'Số lượng trong kho là bắt buộc.',
            'integer' => 'Số lượng trong kho phải là số nguyên.',
            'min' => 'Số lượng trong kho phải lớn hơn hoặc bằng :min.',
        ],
        // Quản lý hình ảnh biến thể
        'product_variant_id' => [
            'required' => 'Sản phẩm biến thể là bắt buộc.',
            'exists' => 'Sản phẩm biến thể không tồn tại.',
        ],
        'image_url' => [
            'required' => 'Đường dẫn hình ảnh là bắt buộc.',
        ],
        // Quản lý mã giảm giá (vouchers)
        'code' => [
            'required' => 'Mã giảm giá là bắt buộc.',
            'unique' => 'Mã giảm giá đã tồn tại, vui lòng chọn mã khác.',
        ],
        'discount_type' => [
            'required' => 'Loại giảm giá là bắt buộc.',
            'in' => 'Loại giảm giá phải là "percentage" hoặc "fixed".',
        ],
        'discount_value' => [
            'required' => 'Giá trị giảm giá là bắt buộc.',
            'numeric' => 'Giá trị giảm giá phải là số.',
            'min' => 'Giá trị giảm giá phải lớn hơn hoặc bằng :min.',
        ],
        'min_order_value' => [
            'numeric' => 'Giá trị đơn hàng tối thiểu phải là số.',
            'min' => 'Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng :min.',
        ],
        'max_discount' => [
            'numeric' => 'Giảm giá tối đa phải là số.',
            'min' => 'Giảm giá tối đa phải lớn hơn hoặc bằng :min.',
        ],
        'usage_limit' => [
            'required' => 'Số lần sử dụng tối đa là bắt buộc.',
            'integer' => 'Số lần sử dụng tối đa phải là số nguyên.',
            'min' => 'Số lần sử dụng tối đa phải lớn hơn hoặc bằng :min.',
        ],
        'used_count' => [
            'integer' => 'Số lần đã sử dụng phải là số nguyên.',
            'min' => 'Số lần đã sử dụng phải lớn hơn hoặc bằng :min.',
        ],
        'start_date' => [
            'required' => 'Ngày bắt đầu là bắt buộc.',
            'date' => 'Ngày bắt đầu phải là ngày hợp lệ.',
        ],
        'end_date' => [
            'required' => 'Ngày kết thúc là bắt buộc.',
            'date' => 'Ngày kết thúc phải là ngày hợp lệ.',
            'after_or_equal' => 'Ngày kết thúc phải từ ngày bắt đầu trở đi.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */
    'attributes' => [
        'name' => 'tên',
        'description' => 'mô tả',
        'status' => 'trạng thái',
        'price' => 'giá',
        'category_id' => 'danh mục',
        'value' => 'giá trị',
        'product_id' => 'sản phẩm',
        'color_id' => 'màu sắc',
        'storage_id' => 'dung lượng',
        'stock' => 'số lượng trong kho',
        'product_variant_id' => 'sản phẩm biến thể',
        'image_url' => 'đường dẫn hình ảnh',
        'code' => 'mã giảm giá',
        'discount_type' => 'loại giảm giá',
        'discount_value' => 'giá trị giảm giá',
        'min_order_value' => 'giá trị đơn hàng tối thiểu',
        'max_discount' => 'giảm giá tối đa',
        'usage_limit' => 'số lần sử dụng tối đa',
        'used_count' => 'số lần đã sử dụng',
        'start_date' => 'ngày bắt đầu',
        'end_date' => 'ngày kết thúc',
    ],
];