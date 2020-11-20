/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @param {Object} [props]           Properties passed from the editor.
 * @param {string} [props.className] Class name generated for the block.
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes, className } ) {
	const handleChange = ( content ) => {
		setAttributes( { content } );
	};

	const updateContent = async ( content ) => {
		const contentParsedFromString = new DOMParser().parseFromString(
			content,
			'text/html'
		);
	
		return contentParsedFromString.body.textContent || html;
	}

	const target = document.querySelector( `.${className}` );

	if (target) {
		target.addEventListener( 'paste', ( event ) => {
			event.preventDefault();

			let paste = (event.clipboardData || window.clipboardData).getData('text');
			
			updateContent( paste ).then( ( contentUpdated ) => {
				const range = document.createRange();
				const textNode = target.childNodes[0];

				const pastedContentPosition = target.innerHTML.indexOf(paste);

				range.setStart(textNode, pastedContentPosition);
				range.setEnd(textNode, pastedContentPosition + paste.length);

				const selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);
				selection.deleteFromDocument();

				selection.getRangeAt(0).insertNode(document.createTextNode(contentUpdated));
			} );
		} );
	}

	return (
		<RichText
			value={ attributes.content }
			onChange={ handleChange }
			className={ className }
		/>
	);
}
