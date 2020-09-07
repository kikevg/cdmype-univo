$(document).ready(function() {
    $('.table').DataTable({
    	language: {
	        processing:     "Cargando datos...",
	        search:         "Buscar:",
	        lengthMenu:    	"Mostrando _MENU_ por pagina",
	        zeroRecords: 	"No hay datos para mostrar",
	        info:           "Mostrando _START_ a _END_ de _TOTAL_ elementos",
	        infoEmpty:      "Mostrando 0 elementos",
	        infoFiltered:   "(filtrado de _MAX_ elementos en total)",
	        paginate: {
	            first:      "Primero",
	            previous:   "Anterior",
	            next:       "Siguiente",
	            last:       "Ultimo"
	        }
    	}
    });
});