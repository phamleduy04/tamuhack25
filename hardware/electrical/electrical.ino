#define RED2_WRITE 25
#define RED1_WRITE 24
#define RED0_WRITE 23
#define GREEN_WRITE 3
#define YELLOW_WRITE 2
#define POT_READ 8
#define WHITE_READ 30
#define BLUE_READ 28



  
// the setup routine runs once when you press reset:
void setup() {                
  // initialize the digital pin as an output.
  pinMode(RED2_WRITE, OUTPUT);
  pinMode(RED1_WRITE, OUTPUT);
  pinMode(RED0_WRITE, OUTPUT);
  pinMode(GREEN_WRITE, OUTPUT);
  pinMode(YELLOW_WRITE, OUTPUT);
  pinMode(POT_READ, INPUT);
  pinMode(WHITE_READ, INPUT);
  pinMode(BLUE_READ, INPUT);
  
}
bool is_error = false;

void no_error(){
  digitalWrite(RED2_WRITE, LOW);
  digitalWrite(RED1_WRITE, LOW);
  digitalWrite(RED0_WRITE, LOW);
  digitalWrite(GREEN_WRITE, HIGH);
  is_error = false;
}

void random_pressing_error_5(){
  digitalWrite(RED2_WRITE, HIGH);
  digitalWrite(RED1_WRITE, HIGH);
  digitalWrite(RED0_WRITE, HIGH);
  digitalWrite(GREEN_WRITE, LOW);
  is_error = true;
}

void disconnected_wire_error_4(){
  digitalWrite(RED2_WRITE, HIGH);
  digitalWrite(RED1_WRITE, HIGH);
  digitalWrite(GREEN_WRITE, LOW);
  is_error = true;
}

void loud_sound_error_3(){

  digitalWrite(RED2_WRITE, HIGH);
  digitalWrite(RED0_WRITE, HIGH);
  digitalWrite(GREEN_WRITE, LOW);
  is_error = true;
}

void random_chance_error_2(){
  digitalWrite(RED1_WRITE, HIGH);
  digitalWrite(RED0_WRITE, HIGH);
  digitalWrite(GREEN_WRITE, LOW);
  is_error = true;
}

// the loop routine runs over and over again forever:

int last_blink = 0;
int last_error = 0;
bool blinked = false;
void loop() {

  // Blinking to know it still operational
  if (last_blink >= 1000){
    last_blink = 0;
    blinked = !blinked;
    digitalWrite(YELLOW_WRITE, blinked);
  }
  //Random press error
  if (is_error == false && analogRead(BLUE_READ) > 1000){
    random_pressing_error_5();
  }

  //Sound sensor
  if  (analogRead(WHITE_READ) > 800){
    loud_sound_error_3();
  }
  


  
 
  delay(10);
  last_blink += 10;
  if (is_error == true) {
    last_error += 10;
  }else{
    last_error = 0;
    no_error();
  }
  
  
}
