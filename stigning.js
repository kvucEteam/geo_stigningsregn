 var dugpunkt = function(temperatur) {
     var dugpunkt = 5.018 + .32321 * temperatur + 8.1847 * 0.001 * (temperatur * temperatur) + 3.1243 * 0.0001 * (temperatur * temperatur * temperatur);
     // console.log("Dugpunktskurve :" + temperatur + ", maks vdi: " + dugpunkt);
     return dugpunkt;
 }

 var canvas_height = $("#myCanvas").height();
 var canvas_width = $("#myCanvas").width();
 $(".canvas_container").css("height", canvas_height)

 var runde = 0;

 var svar_Array = [];
 var accept_svar_Array = [];
 var fejl = 0;
 // Konstante variabler: 

 var mountainwidth = canvas_width / 2 + 50;

 var max_bjerg_hojde = 5000;
 var min_bjerg_hojde = 1500;

 var max_bjerg_start = 1000;

 var max_draw_height;

 var luftfugtighed;

 console.log("MBH: " + max_bjerg_hojde + ", MDH: " + max_draw_height)
 console.log(canvas_height + ", " + canvas_width)

 var sky_group = new Group;
 var rain_group = new Group();

 var raining = false;
 //sky_group.addChild(rain_group);

 var mellemstation_x;
 var mellemstation_y;
 var opg_type = "";
 var vektor_2;
 var sky_vektor;
 var angle;

 var togglestate = "hidden";

 var bundstation;
 var topstation;
 var slutstation;
 var mellemstation;


 $(document).ready(function() {
     console.log();

     opg_type = jsonData.userInterface.opg_type;

     $(".btn_dug").click(function() {
         UserMsgBox("body", "<h2>Dugpunktskurve</h2><img class='img-responsive' src='img/dugpunktskurve.png'");
     });

     $(".btn_svar").click(function() {
         tjek_svar();
     });
     pose_question(runde);
     initializeMountainPath();

     $("#explanationWrapper").html(explanation("Formålet med øvelsen er at øge forståelsen af begreberne aktuel luftfugtighed (AF) og relativ luftfugtighed (RF), dugpunkt og stigningsregn."));
     $('.instr_container').html(instruction("Brug data fra de tre punkter på bjerget til at udfylde alle spørgsmålstegnene i infokasserne ved vejrstationerne"));
     $(".footerCopywrite").eq(0).hide();
     $(".canvas_overlay").css("height", canvas_height);
     $(".mellem_popud").hide();
     $(".spm").hide();
     //$(".spm_instruktion").slideToggle(0);
     $(".btn_help").click(function() {
         show_help();
     });
     $(document).keypress(function(e) {
         if (e.which == 13) {
             console.log($("#UserMsgBox").length);
             if ($("#UserMsgBox").length < 1) {
                 tjek_svar();
             }
         }
     });
     $(".popup_menu").draggable({
         drag: function(event, ui) {
             $(this).css("color", "green")
         }

     });
 });


 function show_help() {
     $(".spm_instruktion").slideToggle();
     if (togglestate == "hidden") {
         $(".glyphicon-chevron-up").show();
         $(".glyphicon-chevron-down").hide();
         togglestate = "visible";
     } else {
         togglestate = "hidden";
         $(".glyphicon-chevron-up").hide();
         $(".glyphicon-chevron-down").show();
     }
     console.log("TS: " + togglestate);
 }

 function initializeMountainPath() {

     if (opg_type == "random") {
         var bjerg_hojde = min_bjerg_hojde + Math.random() * (max_bjerg_hojde - min_bjerg_hojde);
         var bjerg_start = Math.random() * max_bjerg_start;
         var bjerg_slut = Math.abs(bjerg_start - Math.random() * 200);

         while (bjerg_start > (bjerg_hojde - 1500)) {
             var bjerg_start = Math.random() * max_bjerg_start;
             console.log("for lille bjerg_start");
         }

         while (bjerg_slut > (bjerg_hojde - 1500)) {
             var bjerg_slut = Math.random() * max_bjerg_start;
             console.log("for lille bjerg_slut");
         }
         max_draw_height = 8000 / canvas_height;

         var temperatur = 10 + Math.round(Math.random() * 13);

         luftfugtighed = 2 + Math.round(Math.random() * 10);

     } else if (opg_type == "bergen") {
         max_draw_height = 1300 / canvas_height;

         var bjerg_hojde = 643;
         var bjerg_start = 0;
         var bjerg_slut = 132;
         var temperatur = 14; // + Math.round(Math.random() * 13);
         luftfugtighed = 9;
     } else if (opg_type == "patagonien") {
         max_draw_height = 8000 / canvas_height;

         var bjerg_hojde = 3400;
         var bjerg_start = 200;
         var bjerg_slut = 1200;
         var temperatur = 14; // + Math.round(Math.random() * 13);
         luftfugtighed = 9;
     }
     console.log("Bjerg start: " + bjerg_start + ", Bjerg_top: " + bjerg_hojde + " bjerg_slut: " + bjerg_slut);

     var pixel_bjerg_slut = bjerg_slut / max_draw_height;
     var pixel_bjerg_start = bjerg_start / max_draw_height;
     var pixel_bjerg_top = bjerg_hojde / max_draw_height;
     var maks_vdi = dugpunkt(temperatur);

     //POPULER POPUDFELTER: 
     $(".bund_popud").find(".popud_h").html("H: " + Math.floor(bjerg_start) + " moh");
     $(".bund_popud").find(".popud_t").html("T: " + temperatur + "<sup>o</sup>C");
     $(".bund_popud").find(".popud_af").html("AF: " + luftfugtighed + " gr/m<sup>3</sup>");

     $(".top_popud").find(".popud_h").html("H: " + Math.floor(bjerg_hojde) + " moh");
     $(".slut_popud").find(".popud_h").html("H: " + Math.floor(bjerg_slut) + " moh");

     /// GENERER SVAR OG PUT DEM I SVAR ARRAY: 

     ///SVAR 1: 
     svar_1 = Math.round((luftfugtighed / maks_vdi) * 100);

     if (svar_1 > 70 && opg_type == "random") {
         console.log("BROKE IT!");
         initializeMountainPath();
         return;
     }
     svar_Array.push(svar_1);
     accept_svar_Array.push(5);

     //SVAR 2:
     for (var i = 40; i > -20; i--) {

         var vdi_ved_temp = dugpunkt(i);

         if (vdi_ved_temp <= luftfugtighed) {
             svar_2 = i;
             svar_Array.push(svar_2);
             accept_svar_Array.push(2);
             break;
         }
     }
     //OBS!!!! SVAR 3: Hvor mange grader er temperaturen faldet fra bunden: Svar slettet!!!!
     var svar_3 = temperatur - svar_2;
     //svar_Array.push(svar_3);

     // SVAR 4: VED HVILKEN HØJDE REGNER DET
     var svar_4 = Math.round(bjerg_start + (svar_3 * 100));
     svar_Array.push(svar_4);
     accept_svar_Array.push(100);

     if (svar_4 > bjerg_hojde - 500 && opg_type == "random") {
         initializeMountainPath();
         return;
     }

     console.log("maks_vdi: " + maks_vdi + " LF: " + luftfugtighed + "temperatur: " + temperatur + " RH : " + svar_1);
     // Hvad er temperaturen på toppen af bjerget?
     var svar_5 = temperatur - Math.round((bjerg_hojde - svar_4) * .005 + Math.round(svar_4 - bjerg_start) * .010);

     svar_Array.push(svar_5);
     accept_svar_Array.push(2);

     console.log("grader på toppen: " + svar_5);

     //console.log(svar_Array);

     //SVAR_6: maks_vdi på toppen:
     var svar_6 = Math.round(dugpunkt(svar_5));
     svar_Array.push(svar_6);
     accept_svar_Array.push(1);


     var svar_7 = Math.round(svar_5 + (bjerg_hojde - bjerg_slut) * 0.01);

     svar_Array.push(svar_7);
     accept_svar_Array.push(2);


     //SVAR_8 : relativ luftfugtighed i bunden: 
     var svar_8 = Math.round(svar_6 / dugpunkt(svar_7) * 100);

     svar_Array.push(svar_8);
     accept_svar_Array.push(5);


     console.log(svar_Array)



     // UDREGN HVOR MELLEMSATIONSPUNKTET SKAL PLACERES:
     var vektor_1 = new Point(0, canvas_height - pixel_bjerg_start);
     vektor_2 = new Point(mountainwidth, canvas_height - pixel_bjerg_top);
     var vektor_3 = vektor_1 - vektor_2;
     var vektor_4 = vektor_2 - vektor_1;

     var x_vaerdi_mellem_punkt = Math.round(Math.abs(vektor_3.x / vektor_3.y * (svar_4 / max_draw_height)));
     console.log("FHT: " + x_vaerdi_mellem_punkt);
     var forhold = Math.abs(vektor_3.x / vektor_3.y);
     angle = vektor_4.angle;

     console.log("angle" + angle);


     // TEGN BJERG: 
     var mountain_path = new Path();
     // mountain_path.strokeColor = 'white';
     mountain_path.add(new Point(0, canvas_height - pixel_bjerg_start));
     mountain_path.add(new Point(mountainwidth, canvas_height - pixel_bjerg_top));
     mountain_path.add(new Point(canvas_width - 50, canvas_height - pixel_bjerg_slut));
     mountain_path.add(new Point(canvas_width, canvas_height - pixel_bjerg_slut + 10));
     mountain_path.add(new Point(canvas_width, canvas_height));
     mountain_path.add(new Point(0, canvas_height));
     //mountain_path.smooth(1);
     //mountain_path.closed = true;
     mountain_path.fillColor = '#ccc'


     var mountain_shadow = new Path();
     mountain_shadow.add(new Point(0, canvas_height - pixel_bjerg_start));
     mountain_shadow.add(new Point(mountainwidth, canvas_height - pixel_bjerg_top));
     mountain_shadow.add(new Point(mountainwidth + 5, canvas_height - pixel_bjerg_top / 1.5));
     mountain_shadow.add(new Point(mountainwidth - 15, canvas_height - pixel_bjerg_top / 2));
     mountain_shadow.add(new Point(mountainwidth - 10, canvas_height));
     mountain_shadow.add(new Point(0, canvas_height));
     mountain_shadow.fillColor = '#bbb'

     mountain_shadow.sendToBack()
     mountain_path.sendToBack()



     // TEGN TEXFELTER PBA BJERG:

     $(".bund_popud").css("top", canvas_height - pixel_bjerg_start - 130).css("left", 10);

     $(".top_popud").css("left", mountainwidth - 45).css("top", canvas_height - pixel_bjerg_top - 130);

     $(".slut_popud").css("left", canvas_width - 140).css("top", canvas_height - pixel_bjerg_slut - 130);


     /* var bundtext = new PointText({
          point: [3, canvas_height - pixel_bjerg_start - 20],
          content: 'Bund: ' + Math.floor(bjerg_start) + ' m.o.h.',
          fillColor: 'black',
          fontFamily: 'Arial',
          fontSize: 12
      });

      var toptext = new PointText({
          point: [mountainwidth - 40, canvas_height - pixel_bjerg_top - 10],
          content: 'Top: ' + (Math.floor(bjerg_hojde)) + ' m.o.h.',
          fillColor: 'black',
          fontFamily: 'Arial',
          fontSize: 12
      });

      var bundtext = new PointText({
          point: [canvas_width - 220, canvas_height - pixel_bjerg_slut - 12],
          content: 'Bund: ' + (Math.floor(bjerg_slut)) + ' m.o.h.',
          fillColor: 'black',
          fontFamily: 'Arial',
          fontSize: 12
      });*/

     /*
     var bundtemp = new PointText({
         point: [20, canvas_height - 10],
         content: 'Temperatur: ' + temperatur + ' grader',
         fillColor: 'black',
         fontFamily: 'Arial',
         fontSize: 12
     });*/


     //   
     bundstation = new Path.Circle(new Point(9, canvas_height - pixel_bjerg_start - 5), 9);
     bundstation.fillColor = '#56BFC5';
     bundstation.strokeColor = 'white';
     topstation = new Path.Circle(new Point(mountainwidth, canvas_height - pixel_bjerg_top), 9);
     topstation.fillColor = '#999';
     topstation.strokeColor = 'white';
     slutstation = new Path.Circle(new Point(canvas_width - 50, canvas_height - pixel_bjerg_slut), 9);
     slutstation.fillColor = '#999';
     slutstation.strokeColor = 'white';

     mellemstation_x = x_vaerdi_mellem_punkt - pixel_bjerg_start * Math.abs(vektor_3.x / vektor_3.y) - 40;
     mellemstation_y = canvas_height - (svar_4 / max_draw_height);

     //TEGN MELLEMSATIONSPUNKTET - OG GØR DET USYNLIGT:
     var mellemstation_vektor = new Point(x_vaerdi_mellem_punkt - pixel_bjerg_start * Math.abs(vektor_3.x / vektor_3.y), canvas_height - (svar_4 / max_draw_height));
     sky_vektor = (mellemstation_vektor - vektor_2);
     //sky_vektor = sky_vektor.length;
     console.log("vektor_5.length: " + sky_vektor.length);
     mellemstation = new Path.Circle(new Point(x_vaerdi_mellem_punkt - pixel_bjerg_start * Math.abs(vektor_3.x / vektor_3.y), canvas_height - (svar_4 / max_draw_height)), 9);
     mellemstation.fillColor = '#56BFC5';
     mellemstation.strokeColor = 'white';

     mellemstation.opacity = 0;

     console.log("MS - POS:" + mellemstation.position);
     create_cloud();
     sky_group.position.y = topstation.position.y - 10;
     //sky_group.position.x = mellemstation.position.x;
     sky_group.opacity = 0;
     $(".korrekt_svar").html("Korrekt_svar: " + svar_Array[runde]);

     console.log(project);
 }


 function pose_question(runde) {
     $(".korrekt_svar").html("Korrekt_svar: " + svar_Array[runde]);
     $(".spm_header").html("<h6 class='spm_num'>Spørgsmål " + (runde + 1) + "/" + jsonData.spm.length + "</h6 <h4>" + jsonData.spm[runde].spm_header + "</h4>");
     $(".spm").html("<h4>" + jsonData.spm[runde].spm + "</h4>");
     $(".spm_instruktion").html("<p class='instr_text'><b>Instruktion: </b>" + jsonData.spm[runde].spm_instruktion + "</p>").slideUp(0);
     $(".input_value").html(jsonData.spm[runde].value);
     $(".glyphicon-chevron-up").hide();
     $('.svar').val("");
     togglestate = "hidden";
 }

 function tjek_svar() {
     console.log("tjekker svar");
     var korrekt = svar_Array[runde];
     var user_input = $(".svar").val();
     user_input = user_input.replace(",", ".");

     console.log(korrekt + ", user_input: " + user_input + "Accept svar " + svar_Array[runde]);

     if (user_input) {

         if (user_input < (korrekt + accept_svar_Array[runde]) && user_input > (korrekt - accept_svar_Array[runde])) {

             updateBoxes(runde);
             user_input = user_input.replace(".", ",");
             UserMsgBox("body", "<h3>Dit svar: <b>" + user_input + jsonData.spm[runde].value + " </b>er <span class='label label-success'>accepteret</span></h3><p>Systemet har udregnet " + korrekt + jsonData.spm[runde].value + " som det helt korrekte svar. Svaret bliver overført til modellen og det er den værdi du skal arbejde videre med.");
             runde++;
             pose_question(runde);
         } else {
             fejl++;
             user_input = user_input.replace(".", ",");
             UserMsgBox("body", "<h3>Dit svar: <b>" + user_input + jsonData.spm[runde].value + " </b>er desværre <span class='label label-danger'>forkert</span></h3><p>" + jsonData.spm[runde].spm_instruktion + "</p>");
         }
     }
     $(".svar").focus();
 }

 function tweentext(obj) {
     obj.animate({ opacity: 0 }, 0, function() {
         obj.animate({ opacity: 1 }, 500);
     });
 }

 function updateBoxes(num) {

     //$(".popup_menu")
     if (num == 0) {
         bundstation.fillColor = '#999';

         $(".bund_popud").find(".popud_rf").html("RF: " + svar_1 + " %");
         tweentext($(".bund_popud").find(".popud_rf"));
     } else if (num == 1) {
         mellemstation.fillColor = '#56BFC5';
         $(".mellem_popud").find(".popud_t").html("T: " + svar_2 + "<sup>o</sup>C");
         tweentext($(".mellem_popud").find(".popud_t"));
         $(".mellem_popud").show();
         $(".mellem_popud").css("left", mellemstation_x + 60).css("top", mellemstation_y);
         mellemstation.opacity = 1;
         $(".mellem_popud").find(".popud_af").html("AF: " + luftfugtighed + " gr/m<sup>3</sup>");


     } else if (num == 2) {
         raining = true;
         sky_group.opacity = 1;

         $(".mellem_popud").find(".popud_h").html("H: " + svar_Array[num] + " moh");

         $(".mellem_popud").find(".popud_rf").html("RF: 100 %");
         tweentext($(".mellem_popud").find(".popud_rf"));
         tweentext($(".mellem_popud").find(".popud_af"));
         tweentext($(".mellem_popud").find(".popud_h"));
         console.log("FREM MED SKYEN!");
         mellemstation.fillColor = '#999';
         topstation.fillColor = '#56BFC5';

     } else if (num == 3) {

         $(".top_popud").find(".popud_t").html("T: " + svar_Array[num] + "<sup>o</sup>C");
         $(".top_popud").find(".popud_rf").html("RF: 100 %");
         tweentext($(".top_popud").find(".popud_rf"));
         tweentext($(".top_popud").find(".popud_t"));

     } else if (num == 4) {
         $(".top_popud").find(".popud_af").html("AF: " + svar_Array[num] + " gr/m<sup>3</sup>");
         tweentext($(".top_popud").find(".popud_af"));
         topstation.fillColor = '#999';
         slutstation.fillColor = '#56BFC5';

     } else if (num == 5) {
         $(".slut_popud").find(".popud_t").html("T: " + svar_Array[num] + "<sup>o</sup>C");
         $(".slut_popud").find(".popud_af").html("AF: " + svar_Array[4] + " gr/m<sup>3</sup>");
         tweentext($(".slut_popud").find(".popud_af"));
         tweentext($(".slut_popud").find(".popud_t"));
     } else if (num == 6) {
         $(".slut_popud").find(".popud_rf").html("RF: " + svar_Array[num] + " %");
         tweentext($(".slut_popud").find(".popud_rf"));
         $(".spm_container").html("<h4>Du har løst opgaven korrekt - tillykke!</h4><span class='btn btn-info btn-restart'>Prøv med et nyt bjerg</span>");
         $(".btn-restart").click(function() {
             location.reload();
         });
     }
 }

 function create_cloud() {

     var sky_path = new Path.Circle(new Point(mellemstation_x, mellemstation_y), 20);
     sky_path.fillColor = '#fff';
     sky_path.strokeColor = '#eee';
     sky_group = new Group();
     sky_path.opacity = 0;
     console.log("skyPOS: " + sky_group.position.x);
     var svl = Math.floor(sky_vektor.length);
     for (var i = 0; i < svl * 0.8; i++) {
         var copy = sky_path.clone();
         sky_group.addChild(copy);
         copy.scale(Math.random() * 1.6);
         copy.position.x = +Math.random() * svl + mellemstation_x;
         copy.position.y = Math.random() * 50;

         copy.opacity = .2; //Math.random() * 1;

         fillColor = 'grey';
     }



     //sky_path.opacity = 1;

     sky_group.onMouseDrag = function(event) {
             sky_group.position += event.delta;
             // console.log(this.position.y + "," + this.position.x);
         }
         //sky_group.strokeColor = 'black';
     sky_group.opacity = 0;

     //sky_group.position.y = canvas_height - 100;
     //sky_group.position.x = 100;
     //sky_group.rotate(angle);

     //  console.log("Created cloud!");

 }

 function onFrame(event) {

     // Each frame, rotate the path by 3 degrees:
     if (raining == true && runde > 0) {
         make_it_rain();
         if (rain_group.children[0].position.y > canvas_height) {
             rain_group.firstChild.remove();
             //paper.view.update();
         }

         //console.log("hej: " + rain_group.children[0].position.y);
     } else {
         rain_group.removeChildren();
     }

     console.log(rain_group.children.length);



     rain_group.position.y += 13;



 }

 // Reposition the path whenever the window is resized:
 function onResize(event) {
     //console.log("re-initialize");
     //initializePath();

 }

 function make_it_rain() {
     var rain_level = new Group();
     rainfall_path = new Path();
     for (var i = 0; i < 3; i++) {
         var x_pos = sky_vektor.length / 2 - Math.random() * sky_vektor.length;
         var copy = rainfall_path.clone();
         copy.opacity = Math.random() * 1;
         copy.strokeColor = "#fff";
         copy.strokeWidth = .3 + Math.random() * 1.8;
         copy.add(new Point(sky_group.position.x + x_pos, sky_group.position.y + 30));
         copy.add(new Point(sky_group.position.x + 1 + x_pos, sky_group.position.y + 33 + Math.random() * 15));
         //console.log(rainfall_path.position.y);
         rain_level.addChild(copy);
         rain_group.addChild(rain_level);
         //console.log("RGL: " + rain_group.children.length);
     }
 }
