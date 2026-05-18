import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: '¡Hola! 👋 Soy el asistente virtual de MOVICERRI. ¿En qué puedo ayudarte?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const toggleChatbot = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSend = (text) => {
        const msgText = text || input;
        if (!msgText.trim()) return;

        const newMsg = { id: Date.now(), sender: 'user', text: msgText };
        setMessages((prev) => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            let reply = '';
            const lowerMsg = msgText.toLowerCase();

            if (lowerMsg.includes('hola') || lowerMsg.includes('buenas')) {
                reply = '¡Hola! Soy el asistente virtual de MOVICERRI. ¿En qué te puedo ayudar hoy? 😊';
            } else if (lowerMsg.includes('i14')) {
                reply = 'El recorrido I14 se encuentra operando con normalidad. El próximo bus pasará en aproximadamente 5 minutos. 🚌';
            } else if (lowerMsg.includes('i18')) {
                reply = 'El recorrido I18 presenta un retraso leve debido al tráfico. Tiempo estimado de espera: 10 minutos. ⏱️';
            } else if (lowerMsg.includes('i01')) {
                reply = 'El recorrido I01 está fluido. El próximo bus llegará en 2 minutos. 🚍';
            } else if (lowerMsg.includes('recorrido') || lowerMsg.includes('bus') || lowerMsg.includes('micro')) {
                reply = 'Actualmente monitoreamos los recorridos I14, I18 y I01. Puedes preguntarme por el estado de uno en específico, por ejemplo: "¿Cómo está la I14?". 🚌';
            } else if (lowerMsg.includes('report') || lowerMsg.includes('problema')) {
                reply = 'Puedes enviar un reporte de incidencias o aglomeraciones usando el formulario en la sección "Reportes". 📝';
            } else if (lowerMsg.includes('saldo') || lowerMsg.includes('bip') || lowerMsg.includes('tarjeta')) {
                reply = 'Puedes consultar el saldo de tu tarjeta BIP! en la sección "Consulta tu Saldo" ingresando los 8 dígitos de tu tarjeta. 💳';
            } else if (lowerMsg.includes('funciona') || lowerMsg.includes('movicerri')) {
                reply = 'MOVICERRI utiliza cámaras con IA para detectar aglomeraciones en los paraderos y notificar a la municipalidad para despachar más buses en tiempo real. 🤖👀';
            } else {
                reply = 'Lo siento, solo puedo responder preguntas sobre MOVICERRI, recorridos de buses (I14, I18, I01), reportes y saldo BIP. ¿Te puedo ayudar con algo de eso? 🤔';
            }

            setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: reply }]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="chatbot-btn" 
                onClick={toggleChatbot}
                style={{ background: 'var(--color-primary)', boxShadow: '0 0 20px var(--color-primary-glow)', zIndex: 1000 }}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                {!isOpen && <span className="chatbot-pulse"></span>}
            </motion.div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="chatbot-window" 
                        style={{ display: 'flex', border: '1px solid var(--color-glass-border)', boxShadow: 'var(--shadow-lg)', zIndex: 999 }}
                    >
                        <div className="chatbot-header" style={{ background: 'var(--color-primary-dark)' }}>
                            <div className="chatbot-header-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="chatbot-avatar" style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '50%' }}><Bot size={24} /></div>
                                <div>
                                    <strong style={{ display: 'block', lineHeight: 1 }}>Asistente MOVICERRI</strong>
                                    <small style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8, marginTop: '4px' }}>
                                        <span style={{ width: '8px', height: '8px', background: '#4caf50', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 5px #4caf50' }}></span> En línea
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="chatbot-messages" style={{ background: 'var(--color-bg)', backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.02), rgba(0,0,0,0))' }}>
                            {messages.map((msg) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id} 
                                    className={`chat-msg ${msg.sender}`}
                                >
                                    <div className="chat-bubble" style={{ background: msg.sender === 'user' ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)', border: msg.sender === 'bot' ? '1px solid var(--color-glass-border)' : 'none', color: 'white' }}>{msg.text}</div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="chat-msg bot">
                                    <div className="chat-bubble" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--color-glass-border)' }}>
                                        <span className="typing-dot"></span>
                                        <span className="typing-dot"></span>
                                        <span className="typing-dot"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                            
                            {messages.length === 1 && !isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="chat-suggestions">
                                    <button onClick={() => handleSend('¿Cómo funciona MOVICERRI?')} style={{ background: 'rgba(255,69,0,0.1)' }}>¿Cómo funciona?</button>
                                    <button onClick={() => handleSend('¿Cuáles son los recorridos?')} style={{ background: 'rgba(255,69,0,0.1)' }}>Recorridos</button>
                                    <button onClick={() => handleSend('¿Cómo reporto un problema?')} style={{ background: 'rgba(255,69,0,0.1)' }}>Reportar problema</button>
                                    <button onClick={() => handleSend('¿Cómo consulto mi saldo BIP?')} style={{ background: 'rgba(255,69,0,0.1)' }}>Saldo BIP</button>
                                </motion.div>
                            )}
                        </div>
                        <div className="chatbot-input" style={{ background: 'var(--color-glass)', borderTop: '1px solid var(--color-glass-border)' }}>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Escribe tu mensaje..." 
                                onKeyPress={handleKeyPress}
                            />
                            <motion.button whileHover={{ color: 'var(--color-primary)' }} onClick={() => handleSend()} style={{ background: 'transparent', color: 'var(--color-text-secondary)', padding: '15px' }}><Send size={20} /></motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
