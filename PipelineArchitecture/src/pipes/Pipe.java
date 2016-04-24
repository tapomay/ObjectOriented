package pipes;
import java.util.Observable;

public class Pipe<T> extends Observable {

	public static boolean isDataDriven;
	private Message<T> msg;
	private String name;
	
	public Pipe(String name) {
		this.name = name;
	}
	
	public Message<T> read() throws PipeException {
		if (!isDataDriven) {
			this.setChanged();
			this.notifyObservers();
		}
		if (null == msg) {
			throw new PipeException("Message not available.");
		}
		Message<T> ret = msg;
		this.msg = null; //reset msg
//		System.out.println("Read: " + this);
		return ret;
	}
	
	public void write(Message<T> msg) {
		this.msg = msg;
//		System.out.println("Write: " + this);
		if (isDataDriven) {
			this.setChanged();
			this.notifyObservers();
		}
	}

	@Override
	public String toString() {
		return name;
	}

}
