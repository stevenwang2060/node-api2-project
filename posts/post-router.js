const express = require('express');
const router = express.Router();
const db = require('../data/db');

router.post('/', (req, res) => {
    if(req.body.title && req.body.contents){
        db.insert(req.body)
        .then(post => {
            db.findById(post.id)
            .then(newPost => {
                res.status(201).json(newPost);
            })
        })
        .catch(() => {
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        })
    }else{
        res.status(404).json({ errorMessage: "Please provide title and contents for the post." })
    }
});

router.post('/:id/comments', (req, res) => {
    if(req.body.text){
        db.findById(req.params.id)
        .then(post => {
            db.insertComment({ text: req.body.text, post_id: post[0].id})
            .then(comment => {
                db.findCommentById(comment.id)
                .then(comment => {
                    res.status(201).json(comment);
                })
            })
            .catch(() => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" });
            })
        })
        .catch(() => {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        })
    }else{
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    }
});

router.get('/', (req, res) => {
    db.find()
    .then(posts => {
        res.status(201).json(posts);
    })
    .catch(() => {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
});

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if(post.length > 0){ 
            res.status(201).json(post);
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(() => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
});

router.get('/:id/comments', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if(post.length > 0){
            db.findPostComments(post[0].id)
            .then(comments => {
                res.status(201).json(comments);
            })
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(() => {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    })
});

router.delete('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if(post.length > 0){
            db.remove(req.params.id)
            .then(() => {
                res.status(201).json({ message: "The post has succesfully been deleted." });
            })
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(() => {
        res.status(500).json({ error: "The post could not be removed" });
    })
});

router.put('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if(req.body.title && req.body.contents){
            console.log(req.body);
            db.update(post[0].id, req.body)
            .then(newPost => {
                db.findById(post[0].id)
                .then(post => {
                    res.status(200).json(post);
                })
            })
            .catch(() => {
                res.status(500).json({ error: "The post information could not be modified." });
            })
        }else{
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        }
    })
    .catch(() => {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    })
})

module.exports = router;