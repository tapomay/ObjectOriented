package pipes;
import java.util.Observable;
import java.util.function.Supplier;

public class ProducerFilter<T> extends Filter<T> {

	private Supplier<T> produce; // the lambda
	private String name;

	public ProducerFilter(String name, Pipe<T> out, Supplier<T> produce) {
		super(null, out);
		this.produce = produce;
		this.name = name;
	}

	private Message<T> makeContent() {
		Message<T> msg = new Message<T>();
		try {
			T content = produce.get(); //use produce lambda
			msg.setContent(content);
			if (content == null) 
				msg.setQuit(true); //null to end
		} catch(Exception e) {
			e.printStackTrace();
			msg.setQuit(true); //produce failed
		}
		return msg;
	}

	public void start() {
		if (Pipe.isDataDriven) { //start called only in case of data driven mode
			Message<T> msg = makeContent();
			while(!msg.getQuit()) { //keep writing to out until produce lambda quits
				out.write(msg);
				msg = makeContent();
			}
		}
	}

	@Override
	public void update(Observable subject, Object info) {
		if (!Pipe.isDataDriven) { //update called only in case of demand-driven mode
			Message<T> msg = makeContent();
			out.write(msg);
		}
	}
	
	public String toString() {
		return name;
	}
}
