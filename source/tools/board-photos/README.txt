The five ORIGINAL board photographs, kept so the normalisation is reversible.

They were taken in five different places (three near-white studio, one dark purple studio, one a
room with a sofa) and the faces sat at three different sizes in the frame — a detected face width of
132px on one and 376px on another. In a row of five that reads as five photographs, not as one
board.

What replaced them in src/data/assets.ts: each subject separated from its background (u2net human
segmentation), rebuilt on one soft sand backdrop, face scaled to 50% of the frame, eye line at 40%
down, matte feathered 0.7px, output 240x240 JPEG at quality 86 (7-9 KB each, against 34-52 KB).

To go back: base64 each file here and write it into BOARD_PHOTOS as a data:image/jpeg URI.
No face was retouched. Only the frame and what is behind it changed.
