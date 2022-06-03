var exploreFilter = {
    cfrom: 'ANYONE', // ANYONE || ONLY-FOLLOWERS
    creply: 'ALL', // ALL || ONLY-REPLIES
    replies: 0,
    retweets: 0,
    likes: 0,
    from: undefined,
    to: undefined
}

function sendExploreData() {
    
    // console.log(exploreFilter);

    // $('#exploreSpinnerId').show();

    // for (let index = 0; index < 3; index++)
    //     $('#explore-qqqq-container-' + index).empty();

    // console.log('ggg', $('#exploreSpinnerId').is(':visible'));

    // trigger?.();

    showExploreSection(decodeURIComponent(window.location.search.substring(1)), 'replace');

}

function initExploreFilterFromDiv() {

    exploreFilter.cfrom = $('#explore-filter-people-anyone-id').hasClass("explore-filter-people-on") ? "ANYONE" : "ONLY-FOLLOWERS";

    exploreFilter.creply = $('input[name=explore-filter-only-replies-checkbox]').is(':checked') ? 'ONLY-REPLIES' : 'ALL';

    exploreFilter.replies = +$('#explore-filter-min-replies').val();
    exploreFilter.retweets = +$('#explore-filter-min-likes').val();
    exploreFilter.likes = +$('#explore-filter-min-retweets').val();

    exploreFilter.from = $('#explore-filter-from-date').val();
    exploreFilter.to = new Date(new Date().setDate((new Date($('#explore-filter-to-date').val()).getDate() + 1))).toISOString().split('T')[0];

}

// order: TOP, RECENT
$(function() {

    const exploreFilterFromDate = document.getElementById('explore-filter-from-date');
    const exploreFilterToDate = document.getElementById('explore-filter-to-date');

    exploreFilterFromDate.max = new Date().toISOString().split("T")[0];
    exploreFilterToDate.value = new Date().toISOString().split("T")[0];

    initExploreFilterFromDiv();

    function exploreFilterDateChange(id, value) {
        exploreFilter[id] = value;
        sendExploreData();
    }

    function onExploreFilterMinParams(event, element) {
        exploreFilter[element.data('param')] = +element.val();
        sendExploreData();
    }

    $('input[name="explore-filter-min-params"]').on('focusout', function(event) {
        onExploreFilterMinParams(event, $(this));
    })

    $('input[name="explore-filter-min-params"]').on('keyup', function (e) {
        if (e.key === 'Enter')
            $(this).blur();
    });
    
    $('#explore-filter-advance-down-arrow').click(function () {

        if ($(this).data('expanded')) {
            $('#explore-filter-advance-filter-label').text('Show More');

            $('#explore-filter-advanced-block').removeClass('explore-filter-advanced-block-open');
            $('#explore-filter-advanced-block').addClass('explore-filter-advanced-block-close');

            showUI($('#explore-filter-advanced-block'), false);

        } else {
            $('#explore-filter-advance-filter-label').text('Show Less');

            $('#explore-filter-advanced-block').removeClass('explore-filter-advanced-block-close');
            $('#explore-filter-advanced-block').addClass('explore-filter-advanced-block-open');

            showUI($('#explore-filter-advanced-block'));

        }

        $('.explore-filter-advance-filter-toggle-btn').toggleClass('active')
        $(this).data('expanded', !$(this).data('expanded'));

    })

    $('#explore-filter-people-anyone-id').click(function () {
        if (!$(this).hasClass("explore-filter-people-on")) {

            $(this).toggleClass("explore-filter-people-on");
            $('#explore-filter-people-you-follow-id').toggleClass("explore-filter-people-on");

            exploreFilter.cfrom = 'ANYONE';
            sendExploreData();
        }
    })

    $('#explore-filter-people-you-follow-id').click(function () {
        if (!$(this).hasClass("explore-filter-people-on")) {

            $(this).toggleClass("explore-filter-people-on");
            $('#explore-filter-people-anyone-id').toggleClass("explore-filter-people-on");

            exploreFilter.cfrom = 'ONLY-FOLLOWERS';
            sendExploreData();
        }
    })

    $('input[name=explore-filter-only-replies-checkbox]').change(function () {
        exploreFilter.creply = $(this).is(':checked') ? 'ONLY-REPLIES' : 'ALL';
        sendExploreData();
    });

    $('#explore-filter-from-date').on('change', function() {
        exploreFilterDateChange('from', $(this).val())
    })

    $('#explore-filter-to-date').on('change', function() {
        exploreFilterDateChange('to', new Date(new Date().setDate((new Date($(this).val()).getDate() + 1))).toISOString().split('T')[0])
    })

})