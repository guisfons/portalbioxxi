/**
* @version 1.1.0
* Created by Mateus Soares <https://github.com/mateussoares1997>
**/

var Message = {};

(function(){

    'use strict';

    Message = function(params){

        if(typeof params !== "undefined"){

            var valid_display_sides = ["right", "left"];

            if(typeof params.display_side !== "undefined" && valid_display_sides.indexOf(params.display_side) === -1){
                console.error('Invalid "display_side" set param.');
                return false;
            }

            var valid_animations = ["slide", "fade"];

            if(typeof params.animation !== "undefined" && valid_animations.indexOf(params.animation) === -1){
                console.error('Invalid "animation" set param.');
                return false;
            }

        }

        this.options = {
            display_side: "left",
            alerts_limit: 3,
            time_to_fade: 5000,
            animation: "fade"
        };

        this.config = {
            alertsCount: 0
        };

        this.options = $.extend(true, {}, this.options, params);

        this.mountContainer();

    };

    Message.prototype = {

        helper: new Helpers(),

        mountContainer: function(){

            var self = this;

            //Checks whether "itt-message-container" is already created if it's not create creates container
            if($("#itt-message-container").length === 0){

                var html = "";

                html += "<div id='itt-message-container' class='itt-message-container--" + self.options.display_side + "'>";
                html += "</div>";

                $("body").append(html);

            }

        },

        alert: function(alertObject){

            this.handleAlertsLimit();

            this.mountAlert(alertObject);

        },

        handleAlertsLimit: function(){

            var self = this;

            //Check whether quantity of alerts will be exceeded if so remove first alert from container list
            if( ($("#itt-message-container").children().length) >= self.options.alerts_limit ){

                var firstAlert = $("#itt-message-container").children().not(".closing").first();

                var firstAlertKey = $(firstAlert).attr("key");

                $(firstAlert).addClass("closing");

                self.closeAlert(firstAlertKey);

            }

        },

        clearAlerts : function() {
            var self = this;

            $.each($("#itt-message-container").children(), function(index, obj) {
                if (!$(this).hasClass('closing')) {
                    var alertKey = $(this).attr("key");
                    $(this).addClass("closing");
                    self.closeAlert(alertKey);
                }

            });
        },

        mountAlert: function(alertObject){

            var self = this,
            html = "",
            key = ++self.config.alertsCount,
            valid_colors = ["red", "yellow", "green", "blue"],
            alertColor = "",
            animationClass = "";

            if(typeof alertObject.class !== "undefined" && valid_colors.indexOf(alertObject.class) !== -1){
                alertColor = "itt-message--" + alertObject.class;
            }

            if(self.options.animation === "slide"){
                animationClass = "slide-in-from--" + self.options.display_side;
            }else{
                animationClass = "fade-in";
            }

            html += "<div class='itt-message " + alertColor + " slide-from " + animationClass  + "' key='" + key + "'>";
            html += "<div class='itt-message__description'>" + alertObject.description + "</div>";
            html += "<div class='itt-message__close'>x</div>";
            html += "<div class='itt-message__timer'></div>";
            html += "</div>";

            $("#itt-message-container").append(html);

            if(typeof alertObject.keep === "undefined" || alertObject.keep !== true){
                setTimeout(function(){
                    self.closeAlert(key);
                }, self.options.time_to_fade + 1100);
            }

            $("#itt-message-container .itt-message[key=" + key + "] .itt-message__close").on("click", function(){
                self.closeAlert(key);
            });

        },

        closeAlert: function(alertKey){

            var self = this,
            animationClass = "";

            if(self.options.animation === "slide"){
                animationClass = "slide-out-from--" + self.options.display_side;
            }else{
                animationClass = "fade-out";
            }

            $("#itt-message-container .itt-message[key=" + alertKey + "]").slideDown("slow");

            $("#itt-message-container .itt-message[key=" + alertKey + "]").addClass(animationClass);


            setTimeout(function(){
                $("#itt-message-container .itt-message[key=" + alertKey + "]").remove();
            }, 3000);

        }

    }

})();