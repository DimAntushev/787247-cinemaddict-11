export default class CommentAdapter {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.comment = data[`comment`];
    this.date = data[`date`];
    this.emotion = data[`emotion`];
  }

  toRAW() {
    return {
      "id": this.id,
      "author": this.author,
      "comment": this.comment,
      "date": this.date,
      "emotion": this.emotion
    };
  }

  static parseComment(comment) {
    return new CommentAdapter(comment);
  }

  static parseComments(comments) {
    return comments.map(CommentAdapter.parseComment);
  }

  static parseCommentOfAdd(data) {
    return data.comments.map(CommentAdapter.parseComment);
  }

  static clone(comment) {
    return new CommentAdapter(comment.toRAW());
  }
}
