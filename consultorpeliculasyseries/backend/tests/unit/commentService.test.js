import { createComment, updateComment, deleteComment, getCommentsByMovieId, getCommentsBySeriesId } from '../../src/services/commentService.js';
import Comment from '../../src/models/commentModel.js';

jest.mock('../../src/models/commentModel.js');

describe('Comment Service', () => {
    describe('createComment', () => {
        it('should create and return a new comment', async () => {
            const commentData = { content: 'This is a test comment', movieId: 'someMovieId' };
            const userId = 'userId';
            const comment = { ...commentData, userId, _id: 'commentId' };

            Comment.create.mockResolvedValue(comment);

            const result = await createComment(commentData, userId);

            expect(Comment.create).toHaveBeenCalledWith({ ...commentData, userId });
            expect(result).toEqual(comment);
        });
    });

    describe('updateComment', () => {
        it('should update and return the comment if the user is authorized', async () => {
            const commentData = { content: 'This is an updated test comment' };
            const userId = 'userId';
            const commentId = 'commentId';
            const comment = { ...commentData, userId, _id: commentId };

            Comment.findOneAndUpdate.mockResolvedValue(comment);

            const result = await updateComment(commentId, commentData, userId);

            expect(Comment.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: commentId, userId },
                commentData,
                { new: true }
            );
            expect(result).toEqual(comment);
        });
    });

    describe('deleteComment', () => {
        it('should delete the comment if the user is authorized', async () => {
            const userId = 'userId';
            const commentId = 'commentId';

            Comment.findOneAndDelete.mockResolvedValue(true);

            await deleteComment(commentId, userId);

            expect(Comment.findOneAndDelete).toHaveBeenCalledWith({ _id: commentId, userId });
        });
    });

    describe('getCommentsByMovieId', () => {
        it('should return comments for a given movie ID', async () => {
            const movieId = 'someMovieId';
            const comments = [{ content: 'Test comment', movieId }];

            Comment.find.mockResolvedValue(comments);

            const result = await getCommentsByMovieId(movieId);

            expect(Comment.find).toHaveBeenCalledWith({ movieId });
            expect(result).toEqual(comments);
        });
    });

    describe('getCommentsBySeriesId', () => {
        it('should return comments for a given series ID', async () => {
            const seriesId = 'someSeriesId';
            const comments = [{ content: 'Test comment', seriesId }];

            Comment.find.mockResolvedValue(comments);

            const result = await getCommentsBySeriesId(seriesId);

            expect(Comment.find).toHaveBeenCalledWith({ seriesId });
            expect(result).toEqual(comments);
        });
    });
});