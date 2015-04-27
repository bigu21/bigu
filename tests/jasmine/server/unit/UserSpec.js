(function() {
  "use strict";

  describe("User", function() {
    var user;

    beforeEach(function() {
      MeteorStubs.install();
    });

    afterEach(function () {
      MeteorStubs.uninstall();
    });

    describe("if not logged", function() {

      beforeEach(function() {
        this.user = new User();
      });

      it("shoud be able only to sign-up or login", function() {
        this.user.login(function(options, err) {
          expect(err).toBeUndefined();
        });
      });

    });

    describe("when logged", function() {
      it("should always have Facebook service", function() {
      });
    });

  });

})();
