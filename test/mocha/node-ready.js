var isNodeReady = require("node-ready");
var assert = chai.assert;
var should = chai.should() //actually call the function()


describe('isNodeReady(query, success, failure, cfg)', function(){
  //set Timeout for whole test suite
  this.timeout(10000);

  

  describe('if valid query and success callback are passed, isNodeReady()', function(){
    var query;
    var test_node;

    before(function(){
      query = ".test_el";
      test_node = document.createElement('div');
      test_node.className = "test_el";
      document.body.appendChild(test_node);
    });

    after(function(){
      test_node.parentNode.removeChild(test_node);
    })

    it('should fire the success callback, and pass an array of elements found as first param', function(done){
      isNodeReady(query, function(result_array){
        result_array.should.be.a('array', 'should be an array');
        result_array[0].should.equal(test_node, "Success response failed to pass proper node");
        done();
      });
    })
  })

  //
  describe('if NOT valid query OR dom EL not found (within timeout) and failure callback are passed, isNodeReady()', function(){
    var query;

    before(function(){
      query = ".node_doesnt_exist";
    });

    it('should fire the failure callback, and pass the failed query as a string', function(done){
      isNodeReady(query, function(result_array){}, function(failed_query){
        
        failed_query.should.be.a('string', "should be a string");
        failed_query.should.equal(query);

        
        done();

      })
    })
  })

  //
  describe("if node is inserted later (within timeout), or dom isn't ready, isNodeReady()", function(){
    var query;
    var test_node;

    before(function(){
      query = ".test_el";
    });

    after(function(){
      test_node.parentNode.removeChild(test_node);
    })

    //FIXME: Should these 2 be split out?
    //Q: How can we test that it's actually polling the dom?
    it("should poll the dom until found, and return success once found", function(done){
      //after 2 secs, add node to dom
      setTimeout(function(){
        console.log('MOCHA: inserting node for polling');
        test_node = document.createElement('div');
        test_node.className = "test_el";
        document.body.appendChild(test_node);
      }, 2000);

      isNodeReady(query, function(result_array){



        result_array.should.be.a('array', 'should be an array');
        result_array[0].should.equal(test_node, "should be node found");
        done();
      })
    });

    
  });

  //if no callback is found, it should do nothing

  //if CFGs are passed in, those should be tested
  describe("if timeout of 2 (seconds) is passed in, isNodeReady()", function(){
    var query = ".some_unfound_node_meaning_of_life"; //Q: does this need to be in a before?

    //setTimeout of test to 3 seconds
    this.timeout(3000);
    it("should call failure() callback after 2 seconds when node isn't found", function(done){
      var cfg = {timeout: 2}
      isNodeReady(query, function(result_array){}, function(failed_query){
        //don't test the same thing. 
        // we need to verify that only 2 seconds has elapsed
        //the built in timeout() for Mocha does that for us.
        done();
      }, cfg)

    });
  });
  

  // describe("if cfg is passed in, with poll interval of 300 (ms)", function(){
  //   it("should poll the dom every 300 ms.", function(done){
  //     assert.equal(0,1, "in progress");
  //     done();

  //   });
  // });
  


  //"if no timeout is passed in (as part of cfg obj), isNodeReady()"

  //if no configs are passed in, defaults should be used

  

  //

});