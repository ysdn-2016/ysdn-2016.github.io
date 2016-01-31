
var isLetter = /[a-zA-Z0-9]/g;
var contains = function (arr, value) { return arr.indexOf(value) !== -1; }

module.exports = function () {

	var $students = $('.student');
	var $search = $('.student-nav-view-search-input');

	var $gridViewTarget = $('.grid-view-target');
	var $listViewTarget = $('.list-view-target');
	var $categoryTarget = $('.category-target');

	var filters = {
		search: '',
		category: '*'
	};

	/**
	 * Bind events
	 */
	$(window).on('keydown', handleKeyDown);
	$search.on('input', handleSearchInput);
	$students.on('click', handleStudentClick);
  $gridViewTarget.on('click', enableGrid);
  $listViewTarget.on('click', enableList);
	$categoryTarget.on('click', handleCategoryClick);


	function handleKeyDown (e) {
		var char = String.fromCharCode(e.keyCode).toLowerCase();

		// CMD+F override
		if ((e.metaKey || e.ctrlKey) && char === 'f') {
			e.preventDefault();
			$search.focus();
			return;
		}
	}

	function handleStudentClick (e) {
		if (e.target.tagName.toLowerCase() === 'a') {
			return;
		}
		e.preventDefault();
		window.location = $(this).attr('data-url');
	}

	function handleSearchInput (e) {
		filters.search = $search.val().trim();
		updateList();
	}

	function handleCategoryClick (e) {
		e.preventDefault();
		$categoryTarget.removeClass('active');
		$(this).addClass('active');
		filters.category = $(this).attr('data-category');
		updateList();
	}

	function updateList () {
		$students.addClass('hidden');
		$students.filter(byCategory).filter(bySearch).removeClass('hidden');

		function byCategory (i, el) {
			if (filters.category === '*') return true;
			var attr = $(el).attr('data-categories');
			if (!attr) return false;
			var categories = attr.split(',');
			return contains(categories, filters.category);
		}

		function bySearch (i, el) {
			if (!filters.search.length) return true;
			var name = $(el).attr('data-name');
			name = name.toLowerCase();
			name = name.replace(/\s+/g, '');
			return contains(name, filters.search)
		}
	}

	function enableGrid (e) {
		e.preventDefault();
		$('.grid-view').addClass('active');
		$('.list-view').removeClass('active');
		$('.student-grid').removeClass('hidden');
		$('.student-list').addClass('hidden');
	}

	function enableList (e) {
		e.preventDefault();
		$('.list-view').addClass('active');
		$('.grid-view').removeClass('active');
		$('.student-grid').addClass('hidden');
		$('.student-list').removeClass('hidden');
	}

};
