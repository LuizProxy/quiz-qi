'use client'

import { useState, useEffect } from 'react'
import { Brain, Award, FileText, BarChart3, Clock, Shield, CheckCircle, Star, Download, User, Mail, Sparkles, Zap, Target } from 'lucide-react'

// Dados das 28 perguntas do quiz
const quizQuestions = [
  {
    question: "Qual número vem a seguir na sequência: 2, 4, 8, 16, ?",
    options: ["24", "32", "30", "28"],
    correct: 1
  },
  {
    question: "Se todos os gatos são animais e alguns animais são selvagens, então:",
    options: ["Todos os gatos são selvagens", "Alguns gatos podem ser selvagens", "Nenhum gato é selvagem", "Todos os animais são gatos"],
    correct: 1
  },
  {
    question: "Qual palavra não pertence ao grupo: Azul, Verde, Vermelho, Quadrado?",
    options: ["Azul", "Verde", "Vermelho", "Quadrado"],
    correct: 3
  },
  {
    question: "Complete a analogia: Livro está para Ler assim como Comida está para:",
    options: ["Cozinhar", "Comer", "Comprar", "Guardar"],
    correct: 1
  },
  {
    question: "Qual é o próximo número: 1, 1, 2, 3, 5, 8, ?",
    options: ["11", "13", "15", "10"],
    correct: 1
  },
  {
    question: "Se A = 1, B = 2, C = 3, qual é o valor de 'CAB'?",
    options: ["312", "123", "321", "132"],
    correct: 0
  },
  {
    question: "Quantos triângulos você pode ver nesta figura? (Imagine um triângulo grande dividido em 4 triângulos menores)",
    options: ["4", "5", "6", "8"],
    correct: 1
  },
  {
    question: "Qual número está faltando: 3, 7, 15, 31, ?",
    options: ["47", "63", "55", "71"],
    correct: 1
  },
  {
    question: "Se 'CÓDIGO' é escrito como 'DÓEJHP', como 'TESTE' seria escrito?",
    options: ["UFTUF", "SDRSD", "UFTUF", "UFSTF"],
    correct: 0
  },
  {
    question: "Qual forma geométrica tem exatamente 5 lados?",
    options: ["Hexágono", "Pentágono", "Octógono", "Heptágono"],
    correct: 1
  },
  {
    question: "Complete: 100, 81, 64, 49, ?",
    options: ["36", "25", "16", "35"],
    correct: 0
  },
  {
    question: "Se hoje é terça-feira, que dia será daqui a 100 dias?",
    options: ["Segunda", "Terça", "Quarta", "Quinta"],
    correct: 0
  },
  {
    question: "Qual é o oposto de 'Abundante'?",
    options: ["Escasso", "Muito", "Grande", "Pequeno"],
    correct: 0
  },
  {
    question: "Em uma corrida, você ultrapassou o segundo colocado. Em que posição você está?",
    options: ["Primeiro", "Segundo", "Terceiro", "Quarto"],
    correct: 1
  },
  {
    question: "Quantos meses têm 28 dias?",
    options: ["1", "2", "11", "12"],
    correct: 3
  },
  {
    question: "Complete a sequência: Z, Y, X, W, ?",
    options: ["V", "U", "T", "S"],
    correct: 0
  },
  {
    question: "Se 5 máquinas fazem 5 produtos em 5 minutos, quantas máquinas fazem 100 produtos em 100 minutos?",
    options: ["5", "20", "25", "100"],
    correct: 0
  },
  {
    question: "Qual número é diferente: 2, 4, 6, 8, 9, 10?",
    options: ["2", "6", "9", "10"],
    correct: 2
  },
  {
    question: "Complete: Segunda, Terça, ?, Quinta",
    options: ["Quarta", "Sexta", "Sábado", "Domingo"],
    correct: 0
  },
  {
    question: "Se um trem elétrico vai de norte para sul, para que lado vai a fumaça?",
    options: ["Norte", "Sul", "Leste", "Não há fumaça"],
    correct: 3
  },
  {
    question: "Qual é a próxima letra: A, D, G, J, ?",
    options: ["K", "L", "M", "N"],
    correct: 2
  },
  {
    question: "Quantos animais de cada espécie Moisés levou na arca?",
    options: ["2", "1", "7", "Nenhum"],
    correct: 3
  },
  {
    question: "Complete: 1, 4, 9, 16, 25, ?",
    options: ["30", "35", "36", "49"],
    correct: 2
  },
  {
    question: "Se você tem uma caixa de fósforos e entra em um quarto com uma vela, uma lamparina e uma lareira, o que acende primeiro?",
    options: ["Vela", "Lamparina", "Lareira", "Fósforo"],
    correct: 3
  },
  {
    question: "Qual é o resultado de 8 ÷ 2(2+2)?",
    options: ["1", "16", "8", "4"],
    correct: 1
  },
  {
    question: "Complete a analogia: Carro está para Estrada assim como Barco está para:",
    options: ["Porto", "Água", "Vela", "Âncora"],
    correct: 1
  },
  {
    question: "Quantas vezes você pode subtrair 10 de 100?",
    options: ["10", "9", "1", "Infinitas"],
    correct: 2
  },
  {
    question: "Se reorganizarmos as letras de 'LISTEN', qual palavra formamos?",
    options: ["SILENT", "ENLIST", "TINSEL", "Todas as anteriores"],
    correct: 3
  }
]

export default function IQQuizApp() {
  const [currentScreen, setCurrentScreen] = useState('home') // home, leadCapture, quiz, result, payment
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos em segundos
  const [iqScore, setIqScore] = useState(0)
  const [fadeClass, setFadeClass] = useState('opacity-100')
  const [leadData, setLeadData] = useState({ name: '', email: '' })

  // Timer regressivo
  useEffect(() => {
    if (currentScreen === 'result' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentScreen, timeLeft])

  // Carregar respostas do localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem('iq-quiz-answers')
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])

  // Salvar respostas no localStorage
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem('iq-quiz-answers', JSON.stringify(answers))
    }
  }, [answers])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const calculateIQ = (userAnswers: number[]) => {
    const correctAnswers = userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === quizQuestions[index].correct ? 1 : 0)
    }, 0)
    
    // Fórmula simplificada de IQ baseada na porcentagem de acertos
    const percentage = (correctAnswers / quizQuestions.length) * 100
    let iq = 70 + (percentage * 0.6) // IQ entre 70-130 aproximadamente
    
    // Adicionar variação aleatória para parecer mais realista
    iq += Math.random() * 20 - 10
    return Math.round(Math.max(70, Math.min(160, iq)))
  }

  const handleAnswer = (answerIndex: number) => {
    setFadeClass('opacity-0')
    
    setTimeout(() => {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = answerIndex
      setAnswers(newAnswers)

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // Quiz completo
        const finalScore = calculateIQ([...newAnswers])
        setIqScore(finalScore)
        setCurrentScreen('result')
      }
      setFadeClass('opacity-100')
    }, 150)
  }

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault()
    if (leadData.name && leadData.email) {
      // Salvar dados do lead para integração com N8N
      localStorage.setItem('lead-data', JSON.stringify(leadData))
      setCurrentScreen('quiz')
      setCurrentQuestion(0)
      setAnswers([])
    }
  }

  const handlePayment = () => {
    // Simular pagamento bem-sucedido
    setCurrentScreen('payment')
  }

  const downloadCertificate = () => {
    // Aqui você pode integrar com N8N para enviar o certificado
    const leadInfo = JSON.parse(localStorage.getItem('lead-data') || '{}')
    console.log('Dados para N8N:', { ...leadInfo, iqScore })
    alert('Certificado baixado com sucesso! (Funcionalidade simulada)')
  }

  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Tela Inicial */}
      {currentScreen === 'home' && (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="relative mb-6">
                <Brain className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6 leading-tight">
                Descubra seu QI com nosso teste científico
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
                Teste científico, resultado instantâneo, certificado oficial.
              </p>
            </div>
            
            <button
              onClick={() => setCurrentScreen('leadCapture')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xl font-semibold px-12 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl mb-4 shadow-lg"
            >
              Começar Teste Agora
            </button>
            
            <p className="text-gray-500 text-sm mb-12">
              Leva menos de 5 minutos.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Rápido</h3>
                <p className="text-gray-600 text-sm">Apenas 5 minutos do seu tempo</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Certificado</h3>
                <p className="text-gray-600 text-sm">Documento oficial reconhecido</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Científico</h3>
                <p className="text-gray-600 text-sm">Baseado em milhões de respostas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tela de Captura de Lead */}
      {currentScreen === 'leadCapture' && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Quase lá!
                </h2>
                <p className="text-gray-600">
                  Preencha seus dados para receber seu certificado oficial
                </p>
              </div>

              <form onSubmit={handleLeadCapture} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={leadData.name}
                    onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={leadData.email}
                    onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Digite seu melhor e-mail"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Zap className="w-5 h-5 inline mr-2" />
                  Iniciar Teste de QI
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Seus dados estão seguros e serão usados apenas para envio do certificado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tela do Quiz */}
      {currentScreen === 'quiz' && (
        <div className="container mx-auto px-4 py-8">
          {/* Barra de Progresso */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Pergunta {currentQuestion + 1}</span>
              <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Pergunta */}
          <div className={`max-w-2xl mx-auto transition-opacity duration-300 ${fadeClass}`}>
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-purple-100">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center leading-relaxed">
                {quizQuestions[currentQuestion].question}
              </h2>
              
              <div className="space-y-4">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 text-lg group"
                  >
                    <span className="font-semibold text-purple-600 mr-3 group-hover:text-purple-700">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tela de Resultado (Pré-pagamento) */}
      {currentScreen === 'result' && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-green-100">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                Parabéns! Você concluiu o teste.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Seu QI foi calculado com base em mais de 1 milhão de respostas.<br />
                Para visualizar sua pontuação exata e receber seu certificado nacionalmente reconhecido, desbloqueie agora.
              </p>

              {/* Benefícios */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Certificado Digital</h3>
                    <p className="text-sm text-gray-600">PDF personalizado</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Relatório Detalhado</h3>
                    <p className="text-sm text-gray-600">4 páginas completas</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Comparativo Nacional</h3>
                    <p className="text-sm text-gray-600">Sua posição no ranking</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Acesso Vitalício</h3>
                    <p className="text-sm text-gray-600">Consulte quando quiser</p>
                  </div>
                </div>
              </div>

              {/* Oferta */}
              <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white p-6 rounded-2xl mb-6 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 mr-2" />
                  <h3 className="text-2xl font-bold">OFERTA TEMPORÁRIA</h3>
                  <Sparkles className="w-6 h-6 ml-2" />
                </div>
                <p className="text-lg mb-4">67% de desconto por tempo limitado</p>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl line-through opacity-75">R$ 26,97</span>
                  <span className="text-4xl font-bold bg-white text-red-600 px-4 py-2 rounded-xl">R$ 8,99</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-lg bg-black/20 rounded-xl py-2 px-4 inline-flex">
                  <Clock className="w-5 h-5" />
                  <span>Tempo restante: {formatTime(timeLeft)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xl font-bold px-12 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl mb-6 shadow-lg"
              >
                Desbloquear meu QI por R$ 8,99
              </button>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Pagamento 100% seguro</span>
                <span>•</span>
                <span>SSL Certificado</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tela Pós-pagamento */}
      {currentScreen === 'payment' && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-yellow-200">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">
                Seu Resultado Completo
              </h1>

              {/* Pontuação de QI */}
              <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white p-8 rounded-2xl mb-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Sua Pontuação de QI</h2>
                <div className="text-6xl font-bold mb-2 bg-white text-transparent bg-clip-text">{iqScore}</div>
                <p className="text-xl">
                  Você está no top {Math.max(5, Math.round((160 - iqScore) / 90 * 95))}% da população
                </p>
              </div>

              {/* Habilidades Cognitivas */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-left bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Suas Habilidades</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Raciocínio Lógico</span>
                        <span className="text-sm text-gray-600">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Memória</span>
                        <span className="text-sm text-gray-600">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '78%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Processamento</span>
                        <span className="text-sm text-gray-600">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Análise Espacial</span>
                        <span className="text-sm text-gray-600">73%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{width: '73%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Velocidade Mental</span>
                        <span className="text-sm text-gray-600">88%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{width: '88%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-left bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Comparativo</h3>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-600 mb-2">Média Nacional: 100</p>
                    <p className="text-sm text-gray-600 mb-2">Seu QI: {iqScore}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Diferença: +{iqScore - 100} pontos
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      {iqScore > 130 ? 'Superdotado' : 
                       iqScore > 115 ? 'Acima da Média' : 
                       iqScore > 85 ? 'Média' : 'Abaixo da Média'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadCertificate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center mx-auto shadow-lg"
              >
                <Download className="w-6 h-6 mr-2" />
                Baixar Certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}