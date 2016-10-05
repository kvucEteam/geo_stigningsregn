    var canvas_height = $("#myCanvas").height();
    var canvas_width = $("#myCanvas").width();

    var runde = 0;

    var svar_1; 

    // Konstante variabler: 

    var mountainwidth = 200 + Math.random() * canvas_width / 2.5;
    var max_bjerg_hojde = 8000;
    var min_bjerg_hojde = 3500;

    var max_bjerg_start = 2000;

    var max_draw_height = 8000 / canvas_height;

    console.log("MBH: " + max_bjerg_hojde + ", MDH: " + max_draw_height)
    console.log(canvas_height + ", " + canvas_width)

    var sky_group = new Group;
    var rain_group = new Group();
    //sky_group.addChild(rain_group);


        var dugpunkt = function(temperatur){
        var dugpunkt = 6.335 + .6718 * temperatur - 2.0887 * 0.01 * (temperatur * temperatur) + 7.3095 * 0.0001 * (temperatur * temperatur * temperatur);
        return dugpunkt;
    }

    console.log("dugpunkt: " + dugpunkt(-10));



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


        var luftfugtighed = Math.floor(Math.random() * 100);
        var temperatur = Math.floor(Math.random() * 30);

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
            content: 'Absolut luftfugtighed: ' + luftfugtighed + ' %',
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
        make_it_rain();
        position_html();

        function position_html() {
            //$(".btn_abolute").css("left", 20).css("top", canvas_height-10)
        }
    }


    function pose_question(runde) {
        $(".spm_header").html(jsonData.spm[runde].spm_header);
        $(".spm").html(jsonData.spm[runde].spm);
        $(".spm_instruktion").html(jsonData.spm[runde].spm_instruktion)

    }

    function tjek_svar() {
        console.log("tjekker svar");
        var korrekt = jsonData.spm[runde].korrekt_svar;
        var user_input = $(".svar").val();
        console.log(korrekt + ", user_input: " + user_input);

        if (user_input == korrekt) {
            UserMsgBox("body", "DU har svaret korrekt");
               runde ++; 
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

    function onFrame(event) {
        //console.log("hej");
        // Each frame, rotate the path by 3 degrees:
        /*if (sky_group.position.y < canvas_height) {
            make_it_rain();
            console.log("hej: " + rain_group.children[0].position.y);
        } else {

            rain_group.removeChildren();
        }

        //console.log("RGL: " + rainfall_path.length);


        rain_group.position.y += 10;

        console.log()*/
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
