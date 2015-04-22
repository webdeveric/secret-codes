module.exports = function( grunt ) {
    "use strict";

    var openCommand = "open";

    /* jshint ignore:start */
    if ( process.platform === "linux" ) {
        openCommand = "xdg-open";
    }
    /* jshint ignore:end */

    var jsFiles = [ "./Gruntfile.js", "./src/*.js" ],
        config = {

            // https://github.com/gruntjs/grunt-contrib-jshint
            jshint: {
                src: jsFiles,
                options: {
                    jshintrc: "./.jshintrc"
                }
            },

            // https://github.com/jscs-dev/grunt-jscs
            jscs: {
                src: jsFiles,
                options: {
                    config: "./.jscs.json"
                }
            },

            // https://github.com/jsoverson/grunt-plato
            plato: {
                app: {
                    options: {
                        jshint: grunt.file.readJSON(".jshintrc")
                    },
                    files: {
                        "./reports/plato": jsFiles
                    }
                }
            },

            // https://github.com/sindresorhus/grunt-shell
            shell: {
                platoreports: {
                    command: openCommand + " ./reports/plato/index.html"
                }
            },

            watch: {
                js: {
                    files: jsFiles,
                    tasks: [ "js" ]
                }
            }
        };

    grunt.config.init( config );

    // https://github.com/sindresorhus/load-grunt-tasks
    require("load-grunt-tasks")(grunt);

    // https://www.npmjs.com/package/time-grunt
    require("time-grunt")(grunt);

    grunt.registerTask(
        "default",
        [ "js", "watch" ]
    );

    grunt.registerTask(
        "js",
        [ "jshint", "jscs" ]
    );

    grunt.registerTask(
        "reports",
        [ "js", "plato", "shell:platoreports" ]
    );

};
