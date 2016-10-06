     var dugpunkt = function(temperatur) {
         var dugpunkt = 5.018 + .32321 * temperatur + 8.1847 * 0.001 * (temperatur * temperatur) + 3.1243 * 0.0001 * (temperatur * temperatur * temperatur);
         return dugpunkt;
     }

     var temp_regn = function() {}

     var canvas_height = $("#myCanvas").height();
     var canvas_width = $("#myCanvas").width();

     var runde = 0;

     var svar_Array = [];

     // Konstante variabler: 

     var mountainwidth = 200 + Math.random() * canvas_width / 2.5;
     var max_bjerg_hojde = 8000;
     var min_bjerg_hojde = 3500;

     var max_bjerg_start = 1000;

     var max_draw_height = 8000 / canvas_height;

     console.log("MBH: " + max_bjerg_hojde + ", MDH: " + max_draw_height)
     console.log(canvas_height + ", " + canvas_width)

     var sky_group = new Group;
     var rain_group = new Group();

     var raining = false;
     //sky_group.addChild(rain_group);




     console.log("dugpunkt: " + dugpunkt(0));



     $(document).ready(function() {
         $(".btn_dug").click(function() {

             UserMsgBox("body", "<h2>Behold the dugpunktskurve</h2><img class='img-responsive' src='img/dpk.jpg'");
         });


         $(".btn_svar").click(function() {
             tjek_svar();
         });

         initializeMountainPath();
         create_cloud();

         pose_question(runde);
     })

     function initializeMountainPath() {
         var bjerg_hojde = min_bjerg_hojde + Math.random() * (max_bjerg_hojde - min_bjerg_hojde);
         var bjerg_start = Math.random() * max_bjerg_start;
         var bjerg_slut = Math.random() * max_bjerg_start;



         while (bjerg_start > (bjerg_hojde - 1500)) {
             var bjerg_start = Math.random() * max_bjerg_start;
             console.log("for lille bjerg_start");
         }

         while (bjerg_slut > (bjerg_hojde - 1500)) {
             var bjerg_slut = Math.random() * max_bjerg_start;
             console.log("for lille bjerg_slut");
         }

         console.log("Bjerg start: " + bjerg_start + ", Bjerg_top: " + bjerg_hojde + " bjerg_slut: " + bjerg_slut);

         var pixel_bjerg_slut = bjerg_slut / max_draw_height;
         var pixel_bjerg_start = bjerg_start / max_draw_height;
         var pixel_bjerg_top = (bjerg_hojde - bjerg_start) / max_draw_height;

         var mountain_path = new Path();


         var luftfugtighed = 5 + Math.floor(Math.random() * 10);
         var temperatur = 15 + Math.floor(Math.random() * 15);
         var maks_vdi = dugpunkt(temperatur);

         console.log("MVDIH : " + maks_vdi)
         svar_1 = Math.floor((luftfugtighed / maks_vdi) * 100);
         svar_Array.push(svar_1);

         var svar_2; 

         for (var i = 40; i > 0; i--) {

             var vdi_ved_temp = dugpunkt(i);
             console.log("dugpunkt " + i + ": " + dugpunkt(i));

             if (vdi_ved_temp <= luftfugtighed) {
                 svar_2 = i;
                  console.log("Det er den rigtige: " + i);
                 svar_Array.push(svar_2);
                 console.log("SA: " + svar_Array);
                 break;


             } else {
                
             }
         }


         //console.log("svar_2" + svar_2);


         console.log(svar_Array);


         console.log("maks_vdi: " + maks_vdi + " LF: " + luftfugtighed + "temperatur: " + temperatur + " RH : " + svar_1);

         mountain_path.strokeColor = 'white';
         mountain_path.add(new Point(100, canvas_height - pixel_bjerg_start));
         mountain_path.add(new Point(mountainwidth, canvas_height - pixel_bjerg_top));
         mountain_path.add(new Point(canvas_width - 200, canvas_height - pixel_bjerg_slut));
         mountain_path.add(new Point(canvas_width, canvas_height - pixel_bjerg_slut + 10));

         mountain_path.add(new Point(canvas_width, canvas_height));

         mountain_path.add(new Point(0, canvas_height));
         //mountain_path.smooth(1);
         mountain_path.closed = true;
         mountain_path.fillColor = '#ddd';

         //create sky template and group 


         var bundtext = new PointText({
             point: [20, canvas_height - 50],
             content: 'Bund: ' + Math.floor(bjerg_start) + ' m.o.h.',
             fillColor: 'black',
             fontFamily: 'Arial',
             fontSize: 12
         });

         var toptext = new PointText({
             point: [mountainwidth - 40, canvas_height - pixel_bjerg_top],
             content: 'Top: ' + (Math.floor(bjerg_hojde)) + ' m.o.h.',
             fillColor: 'black',
             fontFamily: 'Arial',
             fontSize: 12
         });

         var bundtext = new PointText({
             point: [canvas_width - 200, canvas_height - pixel_bjerg_slut],
             content: 'Bund: ' + (Math.floor(bjerg_slut)) + ' m.o.h.',
             fillColor: 'black',
             fontFamily: 'Arial',
             fontSize: 12
         });
         var bundfugt = new PointText({
             point: [20, canvas_height - 30],
             content: 'Absolut luftfugtighed: ' + luftfugtighed + ' gr/m3',
             fillColor: 'black',
             fontFamily: 'Arial',
             fontSize: 12
         });
         var bundtemp = new PointText({
             point: [20, canvas_height - 10],
             content: 'Temperatur: ' + temperatur + ' grader',
             fillColor: 'black',
             fontFamily: 'Arial',
             fontSize: 12
         });

         /*var infoSpot_bund = new Path.Circle(new Point(100, canvas_height - pixel_bjerg_start), 12);
         infoSpot_bund.fillColor = '#56BFC5';

         infoSpot_bund.onMouseDown = function(event) {
             console.log("clicked" + this);
             this.fillColor = 'green';

         }
*/

         make_it_rain();
         position_html();

         function position_html() {
             //$(".btn_abolute").css("left", 20).css("top", canvas_height-10)
         }
     }


     function pose_question(runde) {
         $(".spm_header").html(jsonData.spm[runde].spm_header);
         $(".spm").html(jsonData.spm[runde].spm);
         $(".spm_instruktion").html("<p class='instr_text'><b>Instruktion:</b>" + jsonData.spm[runde].spm_instruktion + "</p>")

     }

     function tjek_svar() {
         console.log("tjekker svar");
         var korrekt = svar_Array[runde];
         var user_input = $(".svar").val();

         console.log(korrekt + ", user_input: " + user_input);

         if (user_input == korrekt) {
             UserMsgBox("body", "DU har svaret korrekt");
             $(".svar_box").append("<br/>svar" + runde + ": " + svar_Array[runde]);
             runde++;
             pose_question(runde);
         } else {
             UserMsgBox("body", "DU har svaret ikke korrekt");
         }
     }

     function create_cloud() {

         var sky_path = new Path.Circle(new Point(0, 0), 20);
         sky_path.fillColor = 'white';
         sky_path.strokeColor = '#eee';
         sky_group = new Group();

         for (var i = 0; i < 100; i++) {
             var copy = sky_path.clone();
             sky_group.addChild(copy);
             copy.scale(Math.random() * 1.2);
             copy.position += new Point(75 - Math.random() * 150, 10 - Math.random() * 20);
             copy.opacity = Math.random() * .2;

         }

         var cloud_text = new PointText({
             point: [-60, 0],
             content: 'SKY',
             fillColor: 'black',
             fontFamily: 'Arial',
             fontSize: 12
         });


         sky_group.addChild(cloud_text);

         sky_path.opacity = 0;

         sky_group.onMouseDrag = function(event) {
                 sky_group.position += event.delta;
                 console.log(this.position.y + "," + this.position.x);
             }
             //sky_group.strokeColor = 'black';
         sky_group.opacity = 1;

         sky_group.position.y = canvas_height - 100;
         sky_group.position.x = 100;

     }

     var destination = Point.random() * view.size;

     function onFrame(event) {


         //console.log("hej");

         // Animate the cloud: 
         var vector = destination - sky_group.position;

         // We add 1/30th of the vector to the position property
         // of the text item, to move it in the direction of the
         // destination point:
         sky_group.position += vector / 100;

         // Set the content of the text item to be the length of the vector.
         // I.e. the distance it has to travel still:
         sky_group.content = Math.round(vector.length);

         // If the distance between the path and the destination is less
         // than 5, we define a new random point in the view to move the
         // path to:
         if (vector.length < 5) {
             destination = Point.random() * view.size;

         }



         // Each frame, rotate the path by 3 degrees:
         if (raining == true) {
             make_it_rain();
             console.log("hej: " + rain_group.children[0].position.y);
         } else {

             rain_group.removeChildren();
         }

         //console.log("RGL: " + rainfall_path.length);


         rain_group.position.y += 10;

         console.log()
     }

     // Reposition the path whenever the window is resized:
     function onResize(event) {
         //console.log("re-initialize");
         //initializePath();

     }

     function make_it_rain() {
         // create rainfall: 
         var x_pos = 70 - Math.random() * 140;
         rainfall_path = new Path();
         rainfall_path.strokeColor = "#eee";
         rainfall_path.strokeWidth = Math.random() * 3;
         rainfall_path.add(new Point(sky_group.position.x + x_pos, sky_group.position.y + 30));
         rainfall_path.add(new Point(sky_group.position.x + 1 + x_pos, sky_group.position.y + 34))

         rain_group.addChild(rainfall_path);
         //console.log("RGL: " + rain_group.children.length);
     }
