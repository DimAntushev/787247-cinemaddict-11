export default class CommentAdapter {
  constructor(comments) {
    this.id = comments[`id`];
    this.author = comments[`author`];
    this.comment = comments[`comment`];
    this.date = comments[`date`];
    this.emotion = comments[`emotion`];
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
}
