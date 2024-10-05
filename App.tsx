import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import Option from './components/Option';
import { useEffect, useState } from 'react';
import { quizData } from './questions';
import Results from './components/Results';

export default function App() {

  // Estado para autenticación
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [questions, setQuestions] = useState<any>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [checkIfSelected, setCheckIfSelected] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  })
  const [percentageComplete, setPercentageComplete] = useState(0)

  // Simulamos que obtenemos las preguntas del quiz al inicio
  useEffect(() => {
    setQuestions(quizData)
  }, [])

  let currentQuestion = questions[currentQuestionIndex];

  // Calcula el porcentaje del progreso al responder cada pregunta
  useEffect(() => {
    let percentage = (currentQuestionIndex + 1) * 10
    setPercentageComplete(percentage);
  }, [currentQuestionIndex]);

  // Función para manejar la autenticación
  const handleLogin = () => {
    if (username === "futbol" && password === "2024") {
      setIsLoggedIn(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Usuario o contraseña incorrectos");
    }
  };

  // Función para pasar a la siguiente pregunta
  const handleNext = () => {
    let correctAnswer = questions[currentQuestionIndex]?.answer;

    if (selectedOption === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex((prevQuestion) => prevQuestion + 1);
    } else {
      setShowResult(true);
    }

    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: false,
      option4: false,
    })
  }

  // Funciones para seleccionar las opciones
  const checkOptionOne = () => {
    setCheckIfSelected({
      option1: true,
      option2: false,
      option3: false,
      option4: false,
    });
  };

  const checkOptionTwo = () => {
    setCheckIfSelected({
      option1: false,
      option2: true,
      option3: false,
      option4: false,
    });
  };

  const checkOptionThree = () => {
    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: true,
      option4: false,
    });
  };

  const checkOptionFour = () => {
    setCheckIfSelected({
      option1: false,
      option2: false,
      option3: false,
      option4: true,
    });
  };

  // Función para reiniciar el quiz
  const restart = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
  }

  // Mostrar pantalla de resultados si el quiz ha terminado
  if (showResult) return <Results restart={restart} score={score} />

  // Mostrar pantalla de autenticación si el usuario no ha iniciado sesión
  if (!isLoggedIn) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>Inicio de Sesión</Text>

        <TextInput
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TouchableOpacity onPress={handleLogin} style={styles.btn}>
          <Text style={styles.btnText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView>
        <View style={styles.countwrapper} >
          <Text style={{ fontWeight: "600" }}>{currentQuestionIndex + 1}/{questions?.length}</Text>
        </View>

        <View style={styles.questionwrapper} >
          <View style={styles.progresswrapper} >
            <View style={[styles.progressBar, { width: `${percentageComplete}%` }]} ></View>
            <View style={styles.progresscount} >
              <Text style={styles.percentage}>{percentageComplete}%</Text>
            </View>
          </View>

          <Text style={{ fontWeight: "500", textAlign: "center" }}>
            {currentQuestion?.question}
          </Text>
        </View>

        <View style={styles.optionswrapper}>
          <Option setSelectedOption={setSelectedOption} checkIfSelected={checkOptionOne} isSelected={checkIfSelected.option1} option={currentQuestion?.options[0]} />
          <Option setSelectedOption={setSelectedOption} checkIfSelected={checkOptionTwo} isSelected={checkIfSelected.option2} option={currentQuestion?.options[1]} />
          <Option setSelectedOption={setSelectedOption} checkIfSelected={checkOptionThree} isSelected={checkIfSelected.option3} option={currentQuestion?.options[2]} />
          <Option setSelectedOption={setSelectedOption} checkIfSelected={checkOptionFour} isSelected={checkIfSelected.option4} option={currentQuestion?.options[3]} />
        </View>

        <TouchableOpacity onPress={handleNext} activeOpacity={.8} style={styles.btn}>
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4e4e4',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#e4e4e4",
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#004643",
  },
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
  countwrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  questionwrapper: {
    marginTop: 40,
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    alignItems: "center",
  },
  progresswrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#ABD1C6",
    borderRadius: 50,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
    marginTop: -40,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#004643",
    alignSelf: "flex-end",
  },
  progresscount: {
    height: 48,
    width: 48,
    borderRadius: 50,
    backgroundColor: "#fff",
    zIndex: 10,
    position: "absolute",
    top: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontWeight: "600",
    fontSize: 16,
    color: "#004643",
  },
  optionswrapper: {
    marginTop: 30,
    width: "100%",
  },
  btn: {
    width: "100%",
    height: 45,
    borderRadius: 12,
    backgroundColor: "#004643",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
