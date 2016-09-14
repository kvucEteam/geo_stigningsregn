    var mountaintop = 100 + Math.random() * 480;
    //var mountain_baseheight = 1000;
    var mountaintop_moh = mountaintop * 15;
    var mountainwidth = 300 + Math.random() * 100;

    var canvas_mountaintop = $("#myCanvas").height() - mountaintop;

    var sky_group = new Group;
    var rain_group = new Group();
    //sky_group.addChild(rain_group);

    function initializePath() {



        console.log("MT_moh: " + mountaintop_moh);
        console.log("Canvas_height: " + $("#myCanvas").height(), "Canvas_width: " + $("#myCanvas").width());
        console.log("canvas_mountaintop: " + canvas_mountaintop);

        var mountain_path = new Path();
        mountain_path.strokeColor = 'white';
        mountain_path.add(new Point(200, 600));
        mountain_path.add(new Point(mountainwidth, canvas_mountaintop));
        mountain_path.add(new Point(mountainwidth + 75, canvas_mountaintop + 50));
        mountain_path.add(new Point(mountainwidth + 150, canvas_mountaintop + 25));
        mountain_path.add(new Point(900, 600));
        mountain_path.smooth(1);
        mountain_path.closed = true;
        mountain_path.fillColor = '#ddd';

        //create sky template and group 
        var sky_path = new Path.Circle(new Point(100, 500), 20);
        sky_path.fillColor = 'white';
        sky_path.strokeColor = '#eee';


        sky_group = new Group();

        for (var i = 0; i < 500; i++) {
            var copy = sky_path.clone();
            copy.scale(Math.random() * 1.2);
            copy.position += new Point(75 - Math.random() * 150, 10 - Math.random() * 20);
            copy.opacity = Math.random() * .2;
            sky_group.addChild(copy);
        }

        sky_path.opacity = 0;

        sky_group.onMouseDrag = function(event) {
            sky_group.position += event.delta;
            console.log(this.position.y);
        }





        var toptext = new PointText({
            point: [mountainwidth - 40, canvas_mountaintop - 20],
            content: 'Top: ' + (Math.floor(mountaintop_moh)) + ' m.o.h.',
            fillColor: 'black',
            fontFamily: 'Arial',
            fontSize: 12
        });
        var mellemtext = new PointText({
            point: [100, (canvas_mountaintop + ($("#myCanvas").height() - canvas_mountaintop) / 2) - 20],
            content: 'Mellem: ' + Math.floor(mountaintop_moh / 2) + ' m.o.h.',
            fillColor: 'black',
            fontFamily: 'Arial',
            fontSize: 12
        });
        var bundtext = new PointText({
            point: [20, 580],
            content: 'Bund: 0 m.o.h.',
            fillColor: 'black',
            fontFamily: 'Arial',
            fontSize: 12
        });
        var bundtext = new PointText({
            point: [900, 580],
            content: 'Bund: 0 m.o.h.',
            fillColor: 'black',
            fontFamily: 'Arial',
            fontSize: 12
        });
        make_it_rain();
    }

    function onFrame(event) {
        //console.log("hej");
        // Each frame, rotate the path by 3 degrees:
        if (sky_group.position.y < canvas_mountaintop) {
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
        initializePath();

    }


    function make_it_rain() {


        // create rainfall: 
        var x_pos = 70 - Math.random() * 140;
        rainfall_path = new Path();
        rainfall_path.strokeColor = "#eee";
        rainfall_path.strokeWidth = Math.random()*3;
        rainfall_path.add(new Point(sky_group.position.x + x_pos, sky_group.position.y + 30));
        rainfall_path.add(new Point(sky_group.position.x + 1 + x_pos, sky_group.position.y + 34))

        rain_group.addChild(rainfall_path);
        //console.log("RGL: " + rain_group.children.length);





    }
