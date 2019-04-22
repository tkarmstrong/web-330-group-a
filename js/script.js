
$(document).ready(function(){
    
    //GameViewModel
    function GameViewModel(){

      //set variables
      // Tyler's Changes
      let self = this;
      self.firstName = ko.observable("");
      self.lastName = ko.observable("");
      // End Tyler's Changes

      
      self.correctAnswers = ko.observable(0); //BE SURE TO SET TO 0
      self.incorrectAnswers = ko.observable(0); //BE SURE TO SET TO 0
      
      //COMPUTED OBSERVABLE TO ADD INCORRECT AND CORRECT ANSWERS FOR A TOTAL QUESTIONS ANSWERED
      self.totalAnswers = ko.computed(function() {
        return this.correctAnswers() + this.incorrectAnswers();
      }, self);

      self.overallPercentage = ko.computed(function() {
        return (this.correctAnswers() / this.totalAnswers() * 100).toFixed(0) + "%";
      }, self);


      //CUSTOM BINDING TO DISPLAY RANKING
      ko.bindingHandlers.ranking = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var value = ko.unwrap(valueAccessor());
          //alert(value);
          
            if(value >= 8){
              $(element).text("Expert");
            }
            if(value === 6 || value === 7){
              $(element).text("Novice");
            } 
            if(value < 5){
              $(element).text("Beginner");
            } 
        }
      };
         

      //Name Modal button id="startGame" when clicked will trigger startContent to hide and gameContent to show
      $("#startGame").click(function(){
        $("#startContent").hide();
        $("#gameContent").show();
        //close modal
        $('#startModal').modal('toggle');
      });

      //Question Modal Submit answer button
      $("#submitAnswer").click(function(){
        //close modal
        $('#questionModal').modal('toggle');
      });
      
     
     $.getJSON("https://wthomason.github.io/bioSite/data/questions.json", function(data, status) {
      if(status !== 'success') {
        alert("Something went wrong while fetching questions, please try again.");
        return;
      } 
      console.log("your in the ajax baby!!");
      const $dynamicQuestions = $('#dynamicQuestions');
      const categories = data.data.categories;
      
      // empty current category/questions section
      $dynamicQuestions.html('');
      $dynamicQuestions.data('data',data.data.questions);
      // dynamically populate category/questions
      for(let category of categories) {
        const questions = data.data.questions.map(function(question, i) {
          question.questionId = i;
          return question;
        }).filter(function(question) {
          return question.category === category;
        });

        $dynamicQuestions.append(categoryTemplate(category,questions));
        

        //sets questionImage source
        $(".questionImage").attr('src', 'images/question-mark.svg');

        /*
        //on click event to change the image source of .questionImage but only the one that is clicked
        $(".questionImage").click(function(){
          //Change image source
          $(this).attr('src', 'images/js.png');
          //makes image not clickable
          $(this).parent().css("pointer-events", 'none');
        });
        */
      }
      console.log(data.data)
    });
   
      /* Tyler and Drew
      // create function that will check when question submit button is clicked to do the following
      // check to see it answer has been selected if yes go to next step if no stay on question.
      // pull answer input and check if correct return true or false
      // if true add +1 to correct answered variable to display correct answers to user
      // if false add +1 to incorrect answered variable to display correct answers to user
      */
     function incPlus(val) {
      self.num(self.num() + 1);    
    }

    
     self.checkAnswer = function() { 
        var correctValue = $('#rightAnswer').html();
        var radioValue = $("input[name='answer']:checked").val();
        var id = $("#questionId").html();
        var imageClass = '.q' + id;
        var correctValueDecrypted = decryptAnswer(correctValue);
      
      
      if(radioValue === undefined){
        return
      }
      if (correctValueDecrypted === radioValue){
        
        //on click event to change the image source of .questionImage but only the one that is clicked
        
          //Change image source
          $(imageClass).attr('src', 'images/js.png');
          //makes image not clickable
          $(imageClass).parent().css("pointer-events", 'none');

          self.correctAnswers(self.correctAnswers() + 1);
       
      }
      if(correctValueDecrypted != radioValue){
        
        $(imageClass).attr('src', 'images/js.png');
          //makes image not clickable
        $(imageClass).parent().css("pointer-events", 'none');

        self.incorrectAnswers(self.incorrectAnswers() + 1);
      }
      if(self.totalAnswers() === 10){
        $("#startContent").hide();
        $("#gameContent").hide();
        $("#results").show();
      }

        
      
      
    };

      /* William Thomason
      // create function that will take the computed observable totalAnswers and see it it is equal to 10
      // if so then direct user to resualts page
      // take Answers variables and display the grading criteria according to rubric.
      
       Ranking criteria:
        Expert: 8-10 correct answers
        Novice: 6-8 correct answers
        Beginner: Less than 6 correct answers
        var total = 0;
      
     if(total === 10){
      $("#startContent").hide();
      $("#gameContent").hide();
      $("#results").show();        
        
     }
      */
          
     
  };//END OF VIEW MODEL

  
  
  ko.applyBindings(new GameViewModel()); //applying the bindings in the GameViewModel

}); //END OF DOCUMENT.READY FUNCTION

function categoryTemplate(category, questions) {
  return `
    <div class="col-lg-4 text-center">
        <h4>${category}</h4>
        ${questions.map(function(question) {
          return questionTemplate(question);
        }).join('')}
    </div>
  `;
}
function questionTemplate(question) {
  return `
  <div class="row">
    <div class=" col-lg-12 text-center">
        <a href="" data-toggle="modal" data-target="#questionModal" onclick="showQuestionOptions('${question.questionId}')">
            <img  alt="js" class="img-thumbnail questionImage q${question.questionId}">
        </a>
    </div>
  </div>
  `;
}

function answerTemplate(key, answer) {
  return `
  <div class="form-check">
      <input class="form-check-input" type="radio" name="answer" data-bind="checked: userAnswer" id="${key}" value="${key}">
      <label class="form-check-label" for="${key}">
          ${answer}
      </label>
  </div>
  `;
}

function buttonTemplate(key, answer) {
  return `<button type="button" class="btn btn-success" id="submitAnswer">Submit Answer</button>
  
      ${key}
          ${answer}
  `;
}

function showQuestionOptions(questionId) {
  
  // Modal is showing
  // questionId is available here

  const $dynamicQuestions = $('#dynamicQuestions');
  const questions =  $dynamicQuestions.data('data');

  const question = questions[questionId];
  const rightAnswer = question.answer;
  const rightAnswerLowerCase = rightAnswer.toLowerCase();
  const rightAnswerEncrypt = encryptAnswer(rightAnswerLowerCase);
  
  $('#rightAnswer').html(rightAnswerEncrypt);
  $('#questionId').html(questionId);
  const $questionModal = $('#questionModal');
  $('#question', $questionModal).html(question.question);
  const $answers = $('#answers', $questionModal);
  
  $answers.html('');
  if(question.a) $answers.append(answerTemplate('a', question.a));
  if(question.b) $answers.append(answerTemplate('b', question.b));
  if(question.c) $answers.append(answerTemplate('c', question.c));
  if(question.d) $answers.append(answerTemplate('d', question.d));

}
/*
Answer encryption key
a = 1345
b = 2891
c = 9371
d = 7958
*/
function encryptAnswer(value){
  if(value === 'a'){
    return '1345';
  }
  if(value === 'b'){
    return '2891';
  }
  if(value === 'c'){
    return '9371';
  }
  if(value === 'd'){
    return '7958';
  }
}

function decryptAnswer(value){
  if(value === '1345'){
    return 'a';
  }
  if(value === '2891'){
    return 'b';
  }
  if(value === '9371'){
    return 'c';
  }
  if(value === '7958 '){
    return 'd';
  }
}