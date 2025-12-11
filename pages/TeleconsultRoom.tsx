import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  MessageSquare, FileText, Share2, Plus, 
  Send, Maximize2 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

const TeleconsultRoom: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'rx'>('notes');
  const [messages, setMessages] = useState<{sender:string, text:string}[]>([
    {sender: 'system', text: 'Connection established secure.'},
    {sender: 'patient', text: 'Hello Doctor, I can hear you clearly.'}
  ]);
  const [inputText, setInputText] = useState('');

  const handleEndCall = () => {
    if(window.confirm('End consultation and generate summary?')) {
       navigate('/dashboard');
    }
  };

  // Acquire local camera/mic when camOn is true. Keep stream muted for local preview.
  useEffect(() => {
    let mounted = true;

    const startLocal = async () => {
      if (!camOn) return;
      setLocalError(null);
      setIsRequesting(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) return;
        localStreamRef.current = stream;
        setLocalStream(stream);
        // honor mic state
        stream.getAudioTracks().forEach(t => (t.enabled = micOn));
      } catch (err: any) {
        console.error('Could not get user media', err);
        if (err && err.name === 'NotAllowedError') {
          setLocalError('Permission denied. Allow camera and microphone access in your browser.');
        } else if (err && err.name === 'NotFoundError') {
          setLocalError('No camera or microphone found. Please connect a device.');
        } else {
          setLocalError('Unable to access camera/microphone. See console for details.');
        }
        // ensure state is cleared
        localStreamRef.current = null;
        setLocalStream(null);
      } finally {
        setIsRequesting(false);
      }
    };

    const stopLocal = () => {
      const s = localStreamRef.current || localStream;
      if (s) {
        s.getTracks().forEach(t => t.stop());
      }
      localStreamRef.current = null;
      setLocalStream(null);
      setIsRequesting(false);
      if (localVideoRef.current) {
        // detach stream from video element
        // @ts-ignore
        localVideoRef.current.srcObject = null;
      }
    };

    if (camOn) {
      startLocal();
    } else {
      stopLocal();
    }

    return () => {
      mounted = false;
      const s = localStreamRef.current || localStream;
      if (s) s.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camOn]);

  // Toggle audio tracks when micOn changes
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => (t.enabled = micOn));
    }
  }, [micOn, localStream]);

  // Attach/detach MediaStream to the video element when stream changes
  useEffect(() => {
    if (localVideoRef.current) {
      // @ts-ignore
      localVideoRef.current.srcObject = localStream;
      // Try to play (some browsers require play() even when muted)
      const tryPlay = async () => {
        try {
          await localVideoRef.current?.play();
        } catch (err) {
          console.debug('Video play() failed or was blocked:', err);
          // don't treat as fatal; user can interact to start
        }
      };
      tryPlay();
    }
  }, [localStream]);


  const sendMessage = () => {
    if(!inputText.trim()) return;
    setMessages([...messages, {sender: 'me', text: inputText}]);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Video Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/20">
          {/* Main Video Feed (Patient) */}
          {camOn ? (
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1288&q=80" 
              className="w-full h-full object-cover opacity-90"
              alt="Patient Video"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                   <VideoOff size={40} />
                 </div>
                 <p>Camera Off</p>
              </div>
            </div>
          )}

          {/* Self View PIP */}
          <div className="absolute bottom-6 right-6 w-32 h-48 bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl flex items-center justify-center">
            {camOn ? (
              <div className="w-full h-full relative">
                <video
                  ref={localVideoRef}
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Loading / error overlay */}
                {isRequesting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="text-white text-sm">Starting camera…</div>
                  </div>
                )}

                {localError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-4">
                    <div className="text-center text-white space-y-2">
                      <p className="font-semibold">{localError}</p>
                      <p className="text-xs">Check browser permissions or connect a camera.</p>
                      <div className="mt-2">
                        <button
                          onClick={() => {
                            // quick retry: toggle camOff -> camOn to retrigger request
                            setCamOn(false);
                            setTimeout(() => setCamOn(true), 200);
                          }}
                          className="px-3 py-1 rounded bg-primary-600 text-white text-sm"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                    <VideoOff size={18} />
                  </div>
                  <p className="text-xs">No Camera</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <button 
              onClick={() => setMicOn(!micOn)}
              className={`p-4 rounded-xl transition-all ${micOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500/80 text-white hover:bg-red-500'}`}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button 
              onClick={() => setCamOn(!camOn)}
              className={`p-4 rounded-xl transition-all ${camOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500/80 text-white hover:bg-red-500'}`}
            >
              {camOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button 
              onClick={handleEndCall}
              className="p-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 px-8 font-bold"
            >
              <PhoneOff size={20} />
            </button>
            <button className="p-4 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all hidden md:block">
              <Share2 size={20} />
            </button>
          </div>
          
          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/10">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             04:22
          </div>
        </div>
      </div>

      {/* Clinical Panel */}
      <div className="w-full lg:w-96 flex flex-col h-full glass-panel rounded-2xl overflow-hidden border border-white/40 shadow-xl">
         <div className="flex border-b border-white/20">
            {[
              {id: 'notes', label: 'Notes', icon: FileText},
              {id: 'rx', label: 'Rx', icon: Plus},
              {id: 'chat', label: 'Chat', icon: MessageSquare},
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 text-sm font-medium flex justify-center items-center gap-2 transition-colors ${
                  activeTab === tab.id ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-500' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
         </div>

         <div className="flex-1 overflow-auto p-4 bg-white/30">
            {activeTab === 'notes' && (
              <div className="space-y-4 h-full flex flex-col">
                 <h3 className="font-bold text-slate-800">Clinical Notes</h3>
                 <textarea 
                   className="flex-1 w-full bg-white/60 border border-white/40 rounded-xl p-4 resize-none outline-none focus:ring-2 ring-primary-500/50 text-slate-700 placeholder:text-slate-400"
                   placeholder="Type observations here..."
                   defaultValue="Patient reports mild headache since yesterday. BP is normal."
                 />
                 <button className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save to Record</button>
              </div>
            )}

            {activeTab === 'rx' && (
              <div className="space-y-4">
                 <h3 className="font-bold text-slate-800">Add Prescription</h3>
                 <div className="space-y-3">
                    <input type="text" placeholder="Medicine Name" className="w-full p-3 rounded-lg bg-white/60 border border-slate-200 outline-none" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="Dose (e.g. 500mg)" className="w-1/2 p-3 rounded-lg bg-white/60 border border-slate-200 outline-none" />
                      <input type="text" placeholder="Freq (e.g. 1-0-1)" className="w-1/2 p-3 rounded-lg bg-white/60 border border-slate-200 outline-none" />
                    </div>
                    <input type="text" placeholder="Duration (e.g. 5 days)" className="w-full p-3 rounded-lg bg-white/60 border border-slate-200 outline-none" />
                    <button className="w-full py-2 border-2 border-dashed border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 font-medium">
                      + Add Drug
                    </button>
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Current List</p>
                    <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm flex justify-between items-center">
                       <div>
                         <p className="font-medium text-slate-800">Paracetamol</p>
                         <p className="text-xs text-slate-500">500mg • 1-1-1 • After food</p>
                       </div>
                       <button className="text-red-400 hover:text-red-600"><Plus size={18} className="rotate-45" /></button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 mb-4">
                   {messages.map((m, i) => (
                     <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                          m.sender === 'me' 
                            ? 'bg-primary-600 text-white rounded-tr-none' 
                            : m.sender === 'system' 
                              ? 'bg-slate-200 text-slate-500 text-xs text-center w-full' 
                              : 'bg-white shadow-sm text-slate-700 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                     </div>
                   ))}
                </div>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500"
                     placeholder="Type..."
                     value={inputText}
                     onChange={e => setInputText(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && sendMessage()}
                   />
                   <button onClick={sendMessage} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                     <Send size={18} />
                   </button>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default TeleconsultRoom;