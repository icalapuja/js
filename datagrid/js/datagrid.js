/*!
 * Simple DataGrid v0.1.0
 * Copyright 2017 @icalapuja
 * Licensed under MIT (https://github.com/icalapuja/js/datagrid)
 */

(function($){
	var _messages = {'pageTitle': 'Page', 'pageTo':'of', 'noDataFound': 'No data found.'};

	function _getPages(these){
		var pages = parseInt(these._params.data.length / these._params.pagination);
		if(these._params.data.length > (pages * these._params.pagination)){
			pages++;
		}
		return pages;
	}

	function _records(data,start,end){
		var records = [];
		var n=0;

		for(var i in data){
			n++;
			if(n>=start && n<=end){
				records.push(data[i]);
			}
		}

		return records;
	}

	function _loadPage(these,page){
		if(page >= 1 && page <= these._pages){
			$(these).find(".datagrid-pages").val(page);
			$(these).find(".datagrid-pages").change();
		}
	}

	function _header(these){
		var html = "<thead><tr>";
		
		for(var i in these._params.columns){
			html+="<th>"+these._params.columns[i]+"</th>";
		}

		html+="</tr></thead>";

		return html;
	}

	function _body(records){
		return "<tbody class='datagrid-tbody'>"+_bodyContent(records)+"</tbody>";
	}

	function _bodyContent(records){
		var html ="";

		if(records.length > 0){
			for(var i in records){
				var record = records[i];
				html+="<tr>";
				for(var j in record){
					html+="<td>"+record[j]+"</td>";
				}
				html+="</tr>";
			}
		}

		return html;
	}

	function _footer(these){
		var start = 1;
		var end = these._params.pagination;
		var options = "";
		var html = "";
		var navigation = "";

		if(these._params.data.length > these._params.pagination){
			for(i=1;i<=these._pages;i++){
				options+='<option value="'+ i +'" data-start="'+ start +'" data-end="'+ end +'">'+i+'</option>';
				start = end + 1;
				end = end + these._params.pagination;
			}
		}

		if(options != ''){
			navigation+='<div class="datagrid-nav">';
			navigation+="<button class='datagrid-nav-first'> |< </button>";
			navigation+=" <button class='datagrid-nav-prev'> < </button>";
			navigation+=' <label>'+ _messages.pageTitle +'</label> ';
			navigation+=' <select class="datagrid-pages">'+options+'</select> ';
			navigation+=' <label>'+ _messages.pageTo + ' ' + these._pages +'</label> ';
			navigation+=" <button class='datagrid-nav-next'> > </button>";
			navigation+=" <button class='datagrid-nav-last'> >| </button>";
			navigation+="</div>";
		}else{
			if(these._params.data.length == 0){
				navigation = _messages.noDataFound;
			}
		}

		if(navigation != ''){
			html+="<tfoot>";
			html+='<tr>';
				html+='<td colspan="'+(these._params.columns.length)+'">';
				html+=navigation;
				html+="</td>";
			html+="</tr>";
			html+="</tfoot>";
		}
		return html;
	}

	function _navigation(these){
		$(these).find(".datagrid-pages").change(function(e){
			var option = $(these).find(":selected");
			var start = option.attr("data-start");
			var end = option.attr("data-end");
			var html = _bodyContent(_records(these._params.data,start,end));
			$(these).find(".datagrid-tbody").html(html);
			these._params.load(these);
		});

		$(these).find(".datagrid-nav-first").click(function(e){
			_loadPage(these,1);
		});

		$(these).find(".datagrid-nav-prev").click(function(e){
			var page = parseInt($(these).find(".datagrid-pages").val());
			_loadPage(these,--page);
		});

		$(these).find(".datagrid-nav-next").click(function(e){
			var page = parseInt($(these).find(".datagrid-pages").val());
			_loadPage(these,++page);
		});

		$(these).find(".datagrid-nav-last").click(function(e){
			_loadPage(these,these._pages);
		});
	}

	$.fn.extend({
		dataGrid: function(params){
			var html = "";
			var these = this;

			if(params.columns == undefined || params.columns == null){
				params.columns = [];
			}

			if(params.data == undefined || params.data == null){
				params.data = [];
			}

			if(params.pagination == 0 || params.pagination == undefined || params.pagination == null){
				params.pagination = params.data.length;
			}else{
				params.pagination = parseInt(params.pagination);
			}

			if(params.columns.length > 0){
				these._params = params;
				these._pages = _getPages(these);

				// load template
				html+= _header(these);
				html+=_body(_records(these._params.data,0,these._params.pagination));
				html+=_footer(these);
				$(these).html(html);

				// events
				these._params.load(these);
				_navigation(these);
			}
		}
	});
})(jQuery);
