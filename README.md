# 🎓 កិច្ចការស្រាវជ្រាវ (Research Assignment): Bloc with StreamBuilder
### Digital University of Cambodia (សាកលវិទ្យាល័យឌីជីថលកម្ពុជា - DUC)
**Subject:** Mobile App Framework II (Flutter)  
**Lesson 6:** State Management (Bloc)  
**Lecturer:** លោកគ្រូ គ តុលា  
**Topic:** Slide 20 — *Bloc with StreamBuilder ?*

---

## 🌟 Overview & What is Included

This repository provides everything you need to deliver an outstanding presentation to your teacher, including:

1. **Interactive Web Slide Deck (`index.html`):**
   - 12 high-impact, beautifully designed slides with animations and dark/light mode.
   - Built-in **Live Interactive Simulator** (Slide 8) showing data packets flowing through the reactive pipeline in real time.
   - Includes **Speaker Notes** for each slide so you know exactly what to speak in front of the class!
   - Full keyboard navigation, slide drawer index, and fullscreen presentation mode.
2. **Illustrated 3D Architecture Banner (`assets/bloc_streambuilder_banner.jpg`):**
   - High-definition architectural diagram showing the unidirectional reactive stream flow between the Flutter UI, Sinks, StreamControllers, and StreamBuilder.
3. **Pure Dart & Flutter Code Example (`counter_bloc_example.dart`):**
   - A 100% standalone, runnable Flutter implementation of the Counter BLoC using **zero external packages** (pure `dart:async` Streams and Flutter's built-in `StreamBuilder`).

---

## 🚀 How to Run & Present the Slides

### Method 1: Instant Launch (No setup required!)
Simply double-click [`index.html`](file:///e:/Bloc_Strambuilder/index.html) or right-click and open it with **Google Chrome**, **Microsoft Edge**, or **Firefox**.

### Method 2: Local HTTP Server (Optional)
If you prefer running via a local web server:
```bash
# Using Python
python -m http.server 3000

# Or using Node.js / npx
npx serve .
```
Then visit `http://localhost:3000` in your browser.

---

## ⌨️ Presentation Keyboard Shortcuts

| Key | Action |
|---|---|
| <kbd>→</kbd> / <kbd>Space</kbd> / <kbd>PageDown</kbd> | Next Slide |
| <kbd>←</kbd> / <kbd>PageUp</kbd> / <kbd>Backspace</kbd> | Previous Slide |
| <kbd>F</kbd> | Toggle Fullscreen Mode |
| <kbd>O</kbd> | Open Slide Overview Index (Grid View) |
| <kbd>N</kbd> | Open Presenter / Speaker Notes |
| <kbd>T</kbd> | Toggle Dark / Light Theme |
| <kbd>Home</kbd> / <kbd>End</kbd> | Jump to First / Last Slide |

---

## 🧠 Answering the Teacher's Question: "Bloc with StreamBuilder ?"

### 1. What does "Bloc with StreamBuilder" mean?
Before the `flutter_bloc` package was created, Google introduced BLoC at Google I/O 2018 as an architectural design pattern rather than a third-party library. 
- It relies entirely on **pure Dart Streams** (`StreamController`, `Sink`, `Stream` from `dart:async`).
- Flutter provides the **`StreamBuilder<T>`** widget out of the box to listen to those streams and rebuild the UI reactively whenever new state is emitted.

### 2. The 5-Step Architecture Flow:
1. **User Action:** The user presses a button on the UI (e.g., `+`).
2. **Sink (Input):** The UI dispatches an event into the BLoC's sink:  
   `_bloc.eventSink.add(CounterEvent.increment);`
3. **StreamController (BLoC):** The BLoC calculates the business logic and produces a new state value.
4. **Stream (Output):** The BLoC emits the state into the output stream:  
   `_stateController.sink.add(_counter);`
5. **StreamBuilder (UI Rebuild):** The `StreamBuilder<int>` widget listens to `_bloc.counterStream`, receives an `AsyncSnapshot<int>`, and rebuilds **only the target widget subtree**.

---

## 📊 Summary Comparison: StreamBuilder vs BlocBuilder

| Feature | `StreamBuilder` (Native) | `BlocBuilder` (flutter_bloc) |
|---|---|---|
| **External Package** | **None** (Built into Flutter) | Requires `flutter_bloc` & `bloc` |
| **Stream Mechanism** | Standard Dart `Stream<T>` | Abstracted reactive states |
| **Disposal** | **Manual** (must call `dispose()`) | **Automatic** via `BlocProvider` |
| **Conditional Rebuild** | Rebuilds on every emission | Supports `buildWhen: (prev, curr)` |
| **Best For** | Understanding core streams, zero-dependency apps | Large-scale multi-developer production apps |

---

## 📁 File Structure

```text
e:\Bloc_Strambuilder\
├── index.html                  # Main interactive slide deck presentation
├── style.css                   # Modern styling, neon glowing accents & dark theme
├── script.js                   # Slide controls, keyboard events & animated simulator
├── counter_bloc_example.dart   # Clean, runnable pure Dart/Flutter code
├── README.md                   # Complete documentation & talking points
└── assets/
    └── bloc_streambuilder_banner.jpg # 3D high-tech architecture diagram
```
