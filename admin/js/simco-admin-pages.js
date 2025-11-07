(function ($) {
    'use strict';
    $(document).ready(function () {
        // Initialize the page state on load
        function updateImportTypeVisibility() {
            var importType = $('#simco_import_type').val();
            
            // Always show language slug section for both types
            $('#simco_language_slug_section').show();
            
            if (importType === 'taxonomy') {
                $('#simco_post_type_section').hide();
                $('#simco_taxonomy_section').show();
                $('#simco_taxonomy_slug_matching_section').show();
                $('#simco_post_slug_matching_section').hide();
            } else {
                $('#simco_post_type_section').show();
                $('#simco_taxonomy_section').hide();
                $('#simco_taxonomy_slug_matching_section').hide();
                $('#simco_post_slug_matching_section').show();
            }
        }
        
        // Handle import type change to show/hide relevant sections
        $('#simco_import_type').on('change', updateImportTypeVisibility);
        
        // Initialize on page load
        updateImportTypeVisibility();

        // Handle taxonomy slug matching checkbox to show/hide URL slug part selection
        $('#simco_enable_slug_matching_taxonomy').on('change', function() {
            if ($(this).is(':checked')) {
                $('#simco_url_slug_part_taxonomy_section').show();
            } else {
                $('#simco_url_slug_part_taxonomy_section').hide();
            }
        });

        // Handle post slug matching checkbox to show/hide URL slug part selection and hierarchy options
        $('#simco_enable_slug_matching_post').on('change', function() {
            if ($(this).is(':checked')) {
                $('#simco_url_slug_part_post_section').show();
            } else {
                $('#simco_url_slug_part_post_section').hide();
            }
        });

        // Handle language slug removal checkbox to show/hide language slug input
        $('#simco_remove_language_slug').on('change', function() {
            if ($(this).is(':checked')) {
                $('#simco_language_slug_input_section').show();
            } else {
                $('#simco_language_slug_input_section').hide();
            }
        });

        // When the button #simco-start-scraper gets clicked, do an ajax call to scrape all URLs
        $('#simco-start-scraper').on('click', function (e) {
            e.preventDefault();

            // Get all field values
            var urls = $('#simco_urls').val();
            var title_element_id = $('#simco_title_id').val();
            var content_element_id = $('#simco_content_id').val();
            var image_element_id = $('#simco_image_id').val();
            var date_element_id = $('#simco_date_id').val();
            var category_element_id = $('#simco_category_id').val();
            var category_seperator = $('#simco_category_separator').val();
            
            // Import type and related fields
            var import_type = $('#simco_import_type').val();
            var post_type = $('#simco_post_type').val();
            var taxonomy = $('#simco_taxonomy').val();
            
            // Slug matching settings based on import type
            var enable_slug_matching, url_slug_part;
            if (import_type === 'taxonomy') {
                enable_slug_matching = $('#simco_enable_slug_matching_taxonomy').is(':checked') ? 1 : 0;
                url_slug_part = $('#simco_url_slug_part_taxonomy').val();
            } else {
                enable_slug_matching = $('#simco_enable_slug_matching_post').is(':checked') ? 1 : 0;
                url_slug_part = $('#simco_url_slug_part_post').val();
            }
            
            // Post-specific options
            var create_hierarchy = $('#simco_create_hierarchy').is(':checked') ? 1 : 0;
            
            // Language slug removal
            var remove_language_slug = $('#simco_remove_language_slug').is(':checked') ? 1 : 0;
            var language_slug = $('#simco_language_slug').val();

            // Check if the urls are not empty
            if (urls === '') {
                // Hide success alert
                $('#successAlert').hide();
                // Show the error alert
                $('#errorAlert').show();
                // Set the message
                $('#alertErrorMessage').text('Er zijn geen URLs ingevuld');
                return;
            }

            // Validate taxonomy selection if import type is taxonomy
            if (import_type === 'taxonomy' && !taxonomy) {
                $('#successAlert').hide();
                $('#errorAlert').show();
                $('#alertErrorMessage').text('Selecteer een taxonomie voor taxonomie import');
                return;
            }

            // Check if the urls are on multiple lines and split them with a | separator
            if (urls.includes('\n')) {
                urls = urls.split('\n').join('|');
            }

            // Do ajax request to import all objects
            $.ajax({
                url: simple_content_scraper.ajax_url,
                type: 'POST',
                data: {
                    action: 'simco_process_urls',
                    nonce: simple_content_scraper.ajax_settings_nonce,
                    urls: urls,
                    title_element_id: title_element_id,
                    content_element_id: content_element_id,
                    image_element_id: image_element_id,
                    date_element_id: date_element_id,
                    category_element_id: category_element_id,
                    category_seperator: category_seperator,
                    import_type: import_type,
                    post_type: post_type,
                    taxonomy: taxonomy,
                    enable_slug_matching: enable_slug_matching,
                    url_slug_part: url_slug_part,
                    create_hierarchy: create_hierarchy,
                    remove_language_slug: remove_language_slug,
                    language_slug: language_slug
                },
                success: function (response) {
                    // First check if it's no WP JSON error
                    if (!response.success) {
                        // Hide success alert
                        $('#successAlert').hide();
                        // Show the error alert
                        $('#errorAlert').show();
                        // Set the message
                        $('#alertErrorMessage').text('Er is een fout opgetreden: ' + response.data);
                        return;
                    } else {
                        // Hide error alert
                        $('#errorAlert').hide();
                        // Show the alert
                        $('#successAlert').show();
                        // Set the message
                        $('#alertSuccessMessage').text(response.data);
                    }

                },
                error: function (error) {
                    // Hide success alert
                    $('#successAlert').hide();
                    // Show the error alert
                    $('#errorAlert').show();
                    // Set the message
                    $('#alertErrorMessage').text('Er is een fout opgetreden: ' + error.responseText);
                }
            });
        });

        // If .aw-alert-close is clicked, find the first parent called .uk-alert and hide it
        UIkit.util.on('.aw-alert-close', 'click', function (e) {
            e.preventDefault();
            e.target.blur();
            $(e.target).closest('.uk-alert').hide();
        });
    });
})(jQuery);
