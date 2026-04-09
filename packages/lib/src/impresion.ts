export const imprimir_blob = (blob: Blob) => {

    const blobURL = URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    iframe.style.display = 'none';
    iframe.src = blobURL;
    iframe.onload = function () {
        setTimeout(function () {
            iframe.focus();
            iframe.contentWindow?.print();
        }, 1);
    };
}