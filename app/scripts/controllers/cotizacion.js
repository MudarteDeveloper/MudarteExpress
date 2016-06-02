(function(){
  'use strict';
  var app = angular.module('cotizacionExpressApp');
  // app.directive('confirmarCotizacion',function(){
  //
  //     return {
  //       restrict: 'AE',
  //       scope:true,
  //       templateUrl: "views/_confirmarCotizacion.html",
  //
  //     };
  //
  // });
  app.controller('CotizacionCtrl', function (contenedores_resolve,muebles_resolve, $interval,$rootScope, $state, $scope,Users,Direccion, Material,Cotizacion, Contenedor, Mueble, Bulto, Cliente, $http,setting) {
      if(!session){
        $state.go('login');
      }else{
        $scope.limpiarM = true;
              angular.element('#ncotizacion').focus();
            // variables
            $interval(
              function handleInterval() {
                  $rootScope.$broadcast( "change" );
              },0);

      $('.btnsCotizacion').removeClass('hidden');
            $scope.cantidades = [];
            function numeros(){

              for(var i =0;i<100;i++){
                  $scope.cantidades.push({num:i});
              }
              return $scope.cantidades;

            }

            $scope.cant_otros = [];
            function numeros_otros(){
              var i=40;
              while(i<=300){
                  $scope.cant_otros.push({num:i});
                  i+=10;
              }
              return $scope.cant_otros;
            }

            //objecto cliente
            $scope.cliente ={
              nombre:'',
              telefono:'',
              email:''
            };

            // objecto direccion
            var cotizacion = {
              numero_cotizacion:'',
              cliente:'',
              cotizador:'',
              quien_llamo:'',
              quien_cotizo:'',
              fecha_registro:'',
              hora_registro:'',
              fuente:'',
              cp_pv:'',
              tipo_cliente:'Particular',
              cargo:'',
              forma_pago:'',
              fecha_de_carga:'',
              hora_de_carga:'',
              fecha_estimada_mudanza:'',
              hora_estimada_mudanza:'',
              fecha_de_cotizacion:'',
              hora_de_cotizacion:'',
              fecha_de_aviso:'',
              hora_de_aviso:'',
              fecha_de_cierre:'',
              hora_de_cierre:'',
              fecha_real_mudanza:'',
              hora_real_mudanza:'',
              direccion_origen:'',
              barrio_provincia_origen:'',
              observacion_origen:'',
              direccion_destino:'',
              barrio_provincia_destino:'',
              observacion_destino:'',
              recorrido_km:Number(0),
              precio_km:Number(30),
              monto_km:Number(0),
              tiempo_de_carga:Number(0),
              tiempo_de_descarga:Number(0),
              numero_camion:Number(0),
              numero_ayudante:Number(0),
              seguro:'No',
              desarme_mueble:'No',
              ambiente:Number(0),
              rampa:'No',
              mudanza:Number(0),
              soga:Number(0),
              embalaje:Number(0),
              desembalaje:Number(0),
              materiales:Number(0),
              piano_cajafuerte:Number(0),
              ajuste:Number(0),
              iva:Number(0),
              total_monto:Number(0),
              observacion:'',
              total_cantidad:'',
              total_m3:'',
              porcentaje_margen:'',
              total_margen:'',
              estado:''
            }

            $scope.cotizacion = angular.copy(cotizacion);

            $scope.cotizadores = []
            $scope.cotizadores = null;

            $scope.telefonistas = []
            $scope.telefonistas = null;

            $scope.materiales = []
            $scope.materiales = null;

            $scope.contenedores = []
            $scope.contenedores = null;

            $scope.todoscontenedores = []
            $scope.todoscontenedores = null;

            $scope.tipo_muebles = []
            $scope.tipo_muebles = null;

            $scope.barrio_provincias = []
            $scope.barrio_provincias = null;

            $scope.mueble = []
            $scope.mueble = null;

            $scope.muebles_group = []
            $scope.muebles_group = null;

            $scope.contenedores_temp = [];
            $scope.muebles_temp = [];

            $scope.otros_temp = [];
            $scope.otros_temp_campo = [];

            //Variables De Totales
            $scope.metros3_contenedores = 0;
            $scope.unidades_contenedores = 0;

            $scope.metros3_muebles = 0;
            $scope.unidades_muebles = 0;

            $scope.metros3_otros = 0;
            $scope.unidades_otros = 0;

            function buscar_punto(mult_dimension,bultos){
              for(var i = 0;i<bultos.length;i++){
                if((bultos[i].ancho*bultos[i].largo*bultos[i].alto) ===mult_dimension){
                  return bultos[i].punto;
                }
              }
              return 0;
            }

            function recur_punto(a_query,object){
              var punto = 0,resta = angular.copy(object),l=a_query.length;
              if(Number(object.unidad)>0){
                for(var j = 0;j<l;j++){
                  if(Number(object.unidad) >= Number(a_query[j].unidad)){
                    punto += a_query[j].punto;
                    resta.unidad = Number(object.unidad) - Number(a_query[j].unidad);
                    return punto += recur_punto(a_query,resta);
                  }

                }
              }
              return Number(punto);

            };

            function cal_punto(contenedores_temp,todos) {
              for(var i = 0;i<contenedores_temp.length;i++){
                if(todos[0].contenedor===contenedores_temp[i].contenedor){
                  contenedores_temp[i].punto = recur_punto(todos,contenedores_temp[i]);
                }
              }
              return contenedores_temp;
            };

            function calcular_totales(array, attr){
              var result = 0;
              for(var i = 0;i<array.length;i++){
                result += array[i][attr];
              }
              return result;
            }

            function buscar_contenedor(cs_tmp,cont){

              var l = cs_tmp.length;
              for(var i=0;i<l;i++){
                if(cont.contenedor === cs_tmp[i].contenedor ){
                  if(cont.unidad>0){
                      cs_tmp[i].unidad = cont.unidad;
                  }else{
                      cs_tmp.splice(cs_tmp.indexOf(cs_tmp[i]),1);
                  }
                  return true;
                }
              }
              return false;
            };

            function buscar_mueble(ms_tmp,m){
              var l = ms_tmp.length;
              for(var i=0;i<l;i++){
                if(m.mueble === ms_tmp[i].mueble && m.espeficicacion === ms_tmp[i].espeficicacion){
                  if(m.cantidad>0){
                      ms_tmp[i].cantidad = m.cantidad;
                  }else{
                      ms_tmp.splice(ms_tmp.indexOf(ms_tmp[i]),1);
                  }
                  return true;
                }
              }
              return false;
            }

            function buscar_otros(ms_tmp,m){
              var l = ms_tmp.length;
              for(var i=0;i<l;i++){
                if((m.id === ms_tmp[i].id)){
                  if(m.cantidad>0){
                      ms_tmp[i].mueble = m.mueble;
                      ms_tmp[i].ancho = m.ancho;
                      ms_tmp[i].largo = m.largo;
                      ms_tmp[i].alto = m.alto;
                      ms_tmp[i].cantidad = m.cantidad;
                      ms_tmp[i].descripcion = m.descripcion;
                      ms_tmp[i].total_punto = m.punto * m.cantidad;
                  }else{
                      ms_tmp.splice(ms_tmp.indexOf(ms_tmp[i]),1);
                  }
                  return true;
                }
              }
              return false;
            }

            function groupBy( array , f )
            {
              var groups = {};
              array.forEach( function( o )
              {
                var group = JSON.stringify( f(o) );

                groups[group] = groups[group] || [];
                groups[group].push( o );
              });
              return Object.keys(groups).map( function( group )
              {
                return groups[group];
              })
            }

            $scope.muebles = groupBy(muebles_resolve, function(item)
            {
              return [item.espeficicacion, item.descripcion];
            });


            function init(contenedor){
              if(contenedor !== undefined){
                return Contenedor.all(contenedor).then(function(contenedores){
                  $scope.todoscontenedores = contenedores;});
              }else{
                numeros();
                numeros_otros();

                Material.all().then(function(r){
                  var out =[];
                  angular.forEach(r, function(value,key){
                  value.precio = Number(value.precio);
                  out.push(value);
                  },out)
                $scope.materiales = out;
                });

              Users.all(1).then(function(r){
                $scope.cotizadores = r;
              });
              Users.all(2).then(function(r){
                $scope.telefonista = r;
              });
              Direccion.all().then(function(r){
                $scope.barrio_provincias = r;
              });

              $scope.contenedores = contenedores_resolve;

              // Mueble.all('filtrado').then(function(groups){
              //   $scope.muebles_group = groups;
              // }).catch(function(){
              //   $scope.muebles_group = [];
              // });

              // $scope.muebles = muebles_resolve;
              console.log($scope.muebles );
              Mueble.tipo_mueble().then(function(muebles){
                $scope.tipo_muebles = muebles;
              }).catch(function(){
                $scope.tipo_muebles = [];
              });
              $scope.fuentes = Cotizacion.all_fuentes();
              }

              $rootScope.$on('change',function(event){
                if($scope.contenedores_temp.length===0 && $scope.otros_temp.length===0 && $scope.muebles_temp.length===0){
                  $rootScope.resumen = false;
                }else{
                  $rootScope.resumen = true;
                }
              })
            };

            init();

            //Methods
            $scope.check = function (n) {
              (n==='0')? n = '1':n = '0';
              return n;
            }

            $scope.add_contenedor = function(descripcion,uni) {
              var contenedor_temp = {
                contenedor:descripcion,
                unidad:Number(uni),
                punto : 0
              };


              init(descripcion).then(function(){
              if(!buscar_contenedor($scope.contenedores_temp, contenedor_temp)){
                  if(Number(contenedor_temp.unidad)>0){
                    $scope.contenedores_temp.push(contenedor_temp);
                  }
              }
              $scope.contenedores_temp = cal_punto($scope.contenedores_temp, $scope.todoscontenedores);
              $scope.metros3_contenedores = calcular_totales($scope.contenedores_temp,"punto")/10;
              $scope.unidades_contenedores = calcular_totales($scope.contenedores_temp,"unidad");
              });

            };

            $scope.limpiar = function(){
              $scope.contenedores_temp = [];
              $scope.muebles_temp = [];
              $scope.otros_temp = [];
              $scope.otros_temp_campo = [];
              $scope.materiales_temp = [];
              $scope.cotizacion = {};
              // //Variables De Totales
              $scope.metros3_contenedores = 0;
              $scope.unidades_contenedores = 0;
              $scope.metros3_muebles = 0;
              $scope.unidades_muebles = 0;
              $scope.metros3_otros = 0;
              $scope.unidades_otros = 0;
            }

            $scope.add_mueble = function(mueble,uni) {
              var mueble_temp = {
                  // id: 1,
                  // cotizacion: 1,
                  mueble: mueble.descripcion,
                  espeficicacion: mueble.especificacion,
                  descripcion: "",
                  ancho: Number(mueble.ancho),
                  largo: Number(mueble.largo),
                  alto: Number(mueble.alto),
                  cantidad: Number(uni),
                  punto: Number(mueble.punto),
                  total_punto: Number(uni*mueble.punto),
                  estado: "activo"
              };

              if(buscar_mueble($scope.muebles_temp, mueble_temp)!==true){
                if(mueble_temp.cantidad >0){
                    $scope.muebles_temp.push(mueble_temp);
                }
              }
              $scope.metros3_muebles = calcular_totales($scope.muebles_temp,"total_punto")/10;
              $scope.unidades_muebles = calcular_totales($scope.muebles_temp,"cantidad");
            };

            $scope.add_otros = function(campo,mueble,ancho,largo,alto,cant,descripcion,otro){
              console.log(mueble);
              if(ancho!==undefined && largo!==undefined && alto!==undefined && mueble){
               var otro = {
                    id: campo.id,
                    mueble: mueble,
                    descripcion: descripcion,
                    ancho: Number(ancho),
                    largo: Number(largo),
                    alto: Number(alto),
                    cantidad: Number(cant),
                    punto: 0,
                    total_punto: 0,
                    estado: "activo"
                };
                var mult_dimension=otro.ancho*otro.largo*otro.alto;

                if(mueble === 'Otros'){
                  otro.descripcion = descripcion;
                }else{
                  otro.descripcion = mueble;
                }

                otro.punto = Math.round(otro.ancho*otro.largo*otro.alto/100000);
                if(otro.punto===0){
                  otro.punto = 1;
                }
                otro.total_punto = otro.punto * otro.cantidad;
                if(buscar_otros($scope.otros_temp, otro)!==true){
                  if(otro.cantidad >0){
                      $scope.otros_temp.push(otro);
                  }
                }
                $scope.metros3_otros = calcular_totales($scope.otros_temp,"total_punto")/10;
                $scope.unidades_otros = calcular_totales($scope.otros_temp,"cantidad");
              }else{
                alert('Seleccione primero la descripción');
              }
            }

            $scope.add_campo = function(){
              $scope.otro_temp = {id:Math.floor((Math.random() * 1000) + 1)};
              $scope.otros_temp_campo.push($scope.otro_temp);

            }

            $scope.delete_campo = function(campo){
              for(var i = 0;i<$scope.otros_temp.length;i++){
                if($scope.otros_temp[i].id === campo.id){
                  $scope.otros_temp.splice($scope.otros_temp.indexOf($scope.otros_temp[i]),1);
                }
              }
              $scope.otros_temp_campo.splice($scope.otros_temp_campo.indexOf(campo),1);
            };

            $scope.save = function(cot, cliente){
              console.log($scope.materiales_temp);
              $rootScope.nav = '1';
              $scope.limpiar();
              $scope.cotizacion = {};
              $scope.cliente = {};
              $scope.materiales_temp = null;
              $scope.materiales_temp = [];
              $scope.cotizacion = angular.copy(cotizacion);
              angular.element('#ncotizacion').focus();
              $scope.limpiarM = false;
              setTimeout(function(){
                $scope.$apply(function(){
                  $scope.limpiarM = true;
                });
              },1000);


              // var total_cantidad = $scope.unidades_contenedores + $scope.unidades_muebles + $scope.unidades_otros;
              //   var total_m3 = $scope.metros3_contenedores + $scope.metros3_muebles + $scope.metros3_otros;
              //   var cotizacion = {
              //     numero_cotizacion:cot.numero,
              //     cliente:1,
              //     responsable:cot.responsable.id,
              //     total_cantidad:total_cantidad,
              //     total_m3:total_m3,
              //     estado:'activo'
              //   };
              //   Cotizacion.save(cotizacion).then(function(result){
              //     var id_cotizacion = result.data.id;
              //     for(var i=0;i<$scope.contenedores_temp.length;i++){
              //         Cotizacion.save_contenedores($scope.contenedores_temp[i],id_cotizacion);
              //     }
              //     for(var i=0;i<$scope.muebles_temp.length;i++){
              //         Cotizacion.save_muebles($scope.muebles_temp[i],id_cotizacion);
              //     }
              //     for(var i=0;i<$scope.otros_temp.length;i++){
              //         Cotizacion.save_muebles($scope.otros_temp[i],id_cotizacion);
              //     }
              //     // $scope.limpiar();
              //
              //     },function(e){
              //     alert("error");
                // });



            }

            $scope.update_presupuesto = function () {
              $scope.cotizacion.total_monto = Number($scope.cotizacion.mudanza + $scope.cotizacion.soga + $scope.cotizacion.embalaje + $scope.cotizacion.desembalaje + $scope.cotizacion.materiales + $scope.cotizacion.piano_cajafuerte + $scope.cotizacion.ajuste + $scope.cotizacion.iva);
            }
            angular.element('#nCotizacion').focus();

            //temploral de material
            $scope.materiales_temp = [];
            $scope.add_material = function(material,uni, precio) {
              var material_temp = {
                  // id: 1,
                  // cotizacion: 1,
                  material: material.descripcion,
                  cantidad: Number(uni),
                  precio_unitario: Number(precio),
                  total: Number(uni*precio),
                  estado: "activo"
              };

              if(buscar_material($scope.materiales_temp, material_temp)!==true){
                if(material_temp.cantidad >0){
                    $scope.materiales_temp.push(material_temp);
                }
              }
              $scope.cotizacion.materiales = calcular_totales($scope.materiales_temp,"total");
              // console.log($scope.materiales_temp);
              $scope.cotizacion.total_monto = $scope.cotizacion.mudanza + $scope.cotizacion.soga + $scope.cotizacion.embalaje + $scope.cotizacion.desembalaje + $scope.cotizacion.materiales + $scope.cotizacion.piano_cajafuerte + $scope.cotizacion.ajuste + $scope.cotizacion.iva

            };

            function buscar_material(ms_tmp,m){
              var l = ms_tmp.length;
              for(var i=0;i<l;i++){
                if(m.material === ms_tmp[i].material){
                  if(m.cantidad>0){
                      ms_tmp[i].cantidad = m.cantidad;
                      ms_tmp[i].precio_unitario = m.precio_unitario;
                      ms_tmp[i].total = m.total;
                  }else{
                      ms_tmp.splice(ms_tmp.indexOf(ms_tmp[i]),1);
                  }
                  return true;
                }
              }
              return false;
            }
      // temporal parcial_1
          // $scope.parcial1_temp = {};
          $scope.add_parcial1 = function() {
            // console.log($scope.cotizacion);
            $scope.cotizacion.monto_km = Number($scope.cotizacion.recorrido_km * $scope.cotizacion.precio_km);
          }
  }

    });

    app.filter('unique', function () {

        return function (items, filterOn) {

          if (filterOn === false) {
            return items;
          }

          if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
              if (angular.isObject(item) && angular.isString(filterOn)) {
                return item[filterOn];
              } else {
                return item;
              }
            };

            angular.forEach(items, function (item) {
              var valueToCheck, isDuplicate = false;

              for (var i = 0; i < newItems.length; i++) {
                if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                  isDuplicate = true;
                  break;
                }
              }
              if (!isDuplicate) {
                newItems.push(item);
              }

            });
            items = newItems;
          }
          return items;
        };
      });

})();
