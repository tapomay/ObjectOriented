package pipes;

public class Message<T> {

	private T content;
	private Boolean fail = false;
	private Boolean quit = false;

	public Message(T content, Boolean fail, Boolean quit) {
		super();
		this.content = content;
		this.fail = fail;
		this.quit = quit;
	}

	public Message() {
		// TODO Auto-generated constructor stub
	}

	public T getContent() {
		return content;
	}

	public void setContent(T content) {
		this.content = content;
	}

	public Boolean getFail() {
		return fail;
	}

	public void setFail(Boolean fail) {
		this.fail = fail;
	}

	public Boolean getQuit() {
		return quit;
	}

	public void setQuit(Boolean quit) {
		this.quit = quit;
	}

	@Override
	public String toString() {
		return "Message [content=" + content + ", fail=" + fail + ", quit=" + quit + "]";
	}

}
