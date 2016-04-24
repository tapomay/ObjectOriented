package pipes;
import java.util.Observable;
import java.util.function.Consumer;

public class ConsumerFilter<T> extends Filter<T> {

	private Consumer<T> consumer; // the lambda
	private String name;

	public ConsumerFilter(String name, Pipe<T> in, Consumer<T> consumer) {
		super(in, null);
		this.consumer = consumer;
		this.name = name;
	}

	public void start() {
		if (!Pipe.isDataDriven) {
			Message<T> msg = null;
			do {
				try {
					msg = in.read();
				} catch (PipeException e) {
					e.printStackTrace(); //read failed
					continue;
				}
				if (null != msg && !msg.getFail() && !msg.getQuit()) { //bypass- fail or quit
					T content = msg.getContent();
					if (null != content) { //no content
						this.consumer.accept(content); //use lambda
					}
				}
			} while (!msg.getQuit()); //break on quit
		}
	}

	@Override
	public void update(Observable subject, Object info) {
		if (Pipe.isDataDriven) {
			Message<T> msg = null;
			try {
				msg = in.read();
			} catch (PipeException e) {
				System.err.println(e); //read failed
				return;
			}
			if (!msg.getFail() && !msg.getQuit()) { //bypass- fail or quit
				T content = msg.getContent();
				if (null != content) { //no content
					this.consumer.accept(content); //use lambda
				}
			}
		}
	}

	public String toString() {
		return name;
	}
}
