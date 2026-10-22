import 'dart:async';
import 'package:flutter/material.dart';

// ==========================================
// 1. PURE DART BLOC (No flutter_bloc package needed!)
// ==========================================
class CounterBloc {
  int _counter = 0;

  // StreamController to output state to UI
  final _stateController = StreamController<int>.broadcast();
  Stream<int> get counterStream => _stateController.stream;

  // StreamController to receive events from UI
  final _eventController = StreamController<CounterEvent>();
  Sink<CounterEvent> get eventSink => _eventController.sink;

  CounterBloc() {
    // Listen to incoming events and compute new state
    _eventController.stream.listen(_handleEvent);
  }

  void _handleEvent(CounterEvent event) {
    if (event == CounterEvent.increment) {
      _counter++;
    } else if (event == CounterEvent.decrement) {
      _counter--;
    } else if (event == CounterEvent.reset) {
      _counter = 0;
    }
    // Push the updated state into the stream
    _stateController.sink.add(_counter);
  }

  // CRITICAL: Close controllers to prevent memory leaks!
  void dispose() {
    _stateController.close();
    _eventController.close();
  }
}

// Events enum
enum CounterEvent { increment, decrement, reset }

// ==========================================
// 2. FLUTTER APPLICATION
// ==========================================
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'BLoC with StreamBuilder Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const CounterScreen(),
    );
  }
}

// ==========================================
// 3. UI CONSUMING BLOC VIA STREAMBUILDER
// ==========================================
class CounterScreen extends StatefulWidget {
  const CounterScreen({super.key});

  @override
  State<CounterScreen> createState() => _CounterScreenState();
}

class _CounterScreenState extends State<CounterScreen> {
  late final CounterBloc _bloc;

  @override
  void initState() {
    super.initState();
    // Initialize BLoC once in initState (NOT inside build!)
    _bloc = CounterBloc();
  }

  @override
  void dispose() {
    // Crucial: dispose BLoC when widget is removed from widget tree
    _bloc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('BLoC with StreamBuilder'),
        centerTitle: true,
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Current Counter Value:',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            const SizedBox(height: 12),

            // ==========================================
            // STREAMBUILDER LISTENS TO BLOC STREAM
            // ==========================================
            StreamBuilder<int>(
              stream: _bloc.counterStream,
              initialData: 0, // Fallback initial value before first event
              builder: (BuildContext context, AsyncSnapshot<int> snapshot) {
                // Handling Connection States
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                }

                if (snapshot.hasError) {
                  return Text(
                    'Error: ${snapshot.error}',
                    style: const TextStyle(color: Colors.red, fontSize: 18),
                  );
                }

                // Data is ready, render the UI!
                return Text(
                  '${snapshot.data}',
                  style: const TextStyle(
                    fontSize: 64,
                    fontWeight: FontWeight.bold,
                    color: Colors.deepPurple,
                  ),
                );
              },
            ),

            const SizedBox(height: 30),

            // Reset Button
            ElevatedButton.icon(
              onPressed: () => _bloc.eventSink.add(CounterEvent.reset),
              icon: const Icon(Icons.refresh),
              label: const Text('Reset'),
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: Colors.blueGrey,
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          // Decrement Event
          FloatingActionButton(
            heroTag: 'dec_btn',
            onPressed: () => _bloc.eventSink.add(CounterEvent.decrement),
            tooltip: 'Decrement',
            child: const Icon(Icons.remove),
          ),
          const SizedBox(width: 16),
          // Increment Event
          FloatingActionButton(
            heroTag: 'inc_btn',
            onPressed: () => _bloc.eventSink.add(CounterEvent.increment),
            tooltip: 'Increment',
            child: const Icon(Icons.add),
          ),
        ],
      ),
    );
  }
}
