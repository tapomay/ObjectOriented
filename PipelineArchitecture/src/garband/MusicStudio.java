package garband;

import java.util.Random;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.SourceDataLine;

import pipes.ConsumerFilter;
import pipes.Pipe;
import pipes.ProducerFilter;
import pipes.TesterFilter;
import pipes.TransformerFilter;

public class MusicStudio {

	// Music note frequency computation
	enum Note {
		REST, A4, A4$, B4, C4, C4$, D4, D4$, E4, F4, F4$, G4, G4$, A5;

		public static Integer next = 0;

		public static synchronized Note getNext() {
			Note[] notes = Note.values();
			if (next == notes.length - 1) {
				next = 0;
				return null;
			} else {
				next = next + 1;
				return notes[next];
			}
		}

		public double getFrequency() {
			int n = this.ordinal();
			double exp = ((double) n - 1) / 12d;
			double f = 440d * Math.pow(2d, exp);
			return f;
		}
	}

	public static void main(String[] args) {
		MusicStudio studio = new MusicStudio();
		try {
			studio.orchestrate();
		} catch (LineUnavailableException e) {
			System.err.println("Unable to open audio line. Might be a problem with audio on your computer.");
			e.printStackTrace();
		}
	}

	/**
	 * Function with all the logic.
	 * 
	 * @throws LineUnavailableException
	 */
	private void orchestrate() throws LineUnavailableException {
		final AudioFormat af = new AudioFormat(MusicNote.SAMPLE_RATE, 8, 1, true, true);
		SourceDataLine line = AudioSystem.getSourceDataLine(af);
		line.open(af, MusicNote.SAMPLE_RATE);
		line.start();

		// Lambda definitions start...
		/**
		 * The producer lambda:
		 *   Generates frequency from enum Note.
		 *   Chooses a random amplitude and duration.
		 *   Returns null once all notes have been used at least once.
		 */
		Supplier<MusicNote> produce = () -> {
			Note note = Note.getNext();
			if (null == note) {
				return null;
			}
			double frequency = note.getFrequency();
			Float amplitude = Float.valueOf(new Random().nextInt(MusicNote.MAX_AMP));
			Integer duration = new Random().nextInt(MusicNote.MAX_DUR);
			MusicNote ret = new MusicNote(note.name(), frequency, amplitude, duration);
			return ret;
		};

		/**
		 * Transform lambda: 
		 *   Transforms all zero duration notes to be audible
		 */
		Function<MusicNote, MusicNote> transform = (MusicNote inNote) -> {
			if (inNote.getDuration() == 0) {
				inNote.setDuration(1);
				System.out.println("Transformed duration: 0 to 1");
			}
			return inNote;
		};

		/**
		 * Tester lambda:
		 *   Filters out notes with amplitude > 80
		 */
		Predicate<MusicNote> test = (MusicNote inNote) -> {
			if (inNote.getAmplitude() > 80) {
				System.out.println("Filtered amplitude>80 : " + inNote);
				return false;
			}
			return true;
		};

		/**
		 * Consumer lambda:
		 *   Plays a given note.
		 */
		Consumer<MusicNote> consume = (MusicNote note) -> {
			int ms = note.getDuration() * 1000;
			int length = MusicNote.SAMPLE_RATE * ms / 1000;
			int count = line.write(note.data(), 0, length);
			System.out.println(note);
		};
		// ...Lambda definitions end

		System.out.println("Testing Data-driven:");
		dataDriven(produce, transform, test, consume);
		System.out.println("Data-driven Complete.");

		System.out.println("Testing Demand-driven:");
		demandDriven(produce, transform, test, consume);
		System.out.println("Demand-driven complete.");

		line.drain();
		line.close();
	}

	/**
	 * Constructs a data driven pipeline and uses the lambdas as filter
	 * operators
	 * 
	 * @param produce
	 * @param transform
	 * @param test
	 * @param consume
	 */
	private void dataDriven(Supplier<MusicNote> produce, Function<MusicNote, MusicNote> transform,
			Predicate<MusicNote> test, Consumer<MusicNote> consume) {
		Pipe.isDataDriven = true;
		Pipe<MusicNote>[] pipes = createPipes();
		ProducerFilter<MusicNote> producer = new ProducerFilter<MusicNote>("Producer", pipes[0], produce);
		TransformerFilter<MusicNote> transformer = new TransformerFilter<MusicNote>("Transformer", pipes[0], pipes[1],
				transform);
		TesterFilter<MusicNote> tester = new TesterFilter<MusicNote>("Tester", pipes[1], pipes[2], test);
		ConsumerFilter<MusicNote> consumer = new ConsumerFilter<MusicNote>("Consumer", pipes[2], consume);
		producer.start();
	}

	/**
	 * Constructs a demand driven pipeline and uses the lambdas as filter
	 * operators
	 * 
	 * @param produce
	 * @param transform
	 * @param test
	 * @param consume
	 */
	private void demandDriven(Supplier<MusicNote> produce, Function<MusicNote, MusicNote> transform,
			Predicate<MusicNote> test, Consumer<MusicNote> consume) {
		Pipe.isDataDriven = false;
		Pipe<MusicNote>[] pipes = createPipes();
		ProducerFilter<MusicNote> producer = new ProducerFilter<MusicNote>("Producer", pipes[0], produce);
		TransformerFilter<MusicNote> transformer = new TransformerFilter<MusicNote>("Transformer", pipes[0], pipes[1],
				transform);
		TesterFilter<MusicNote> tester = new TesterFilter<MusicNote>("Tester", pipes[1], pipes[2], test);
		ConsumerFilter<MusicNote> consumer = new ConsumerFilter<MusicNote>("Consumer", pipes[2], consume);
		consumer.start();
	}

	private Pipe<MusicNote>[] createPipes() {
		Pipe<MusicNote>[] ret = new Pipe[3];
		ret[0] = new Pipe<MusicNote>("InPipe");
		ret[1] = new Pipe<MusicNote>("TxPipe");
		ret[2] = new Pipe<MusicNote>("TestPipe");
		return ret;
	}

}
