import document from 'global/document';
import window from 'global/window';
import AWS from 'aws-sdk';

AWS.config.update({
    region: 'eu-west-1',
    credentials: new AWS.Credentials({
        // eslint-disable-next-line no-undef
        accessKeyId: awsAccessKey,
        // eslint-disable-next-line no-undef
        secretAccessKey: awsSecretKey,
    }),
});

export const listObjects = () => new Promise((resolve, reject) => {
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: 'image-pwa-upload' },
    });
    s3.listObjects({ Delimiter: '/' }, (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    });
});

export const downloadImage = (Key, url) => {
    const params = { Bucket: 'image-pwa-upload', Key };
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: 'image-pwa-upload' },
    });
    s3.getObject(params, (err, data) => {
        if (err) {
            alert(err);
        } else {
            const blob = new Blob([data.Body], { type: data.ContentType });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = url;
            link.click();
        }
    });
};

export const uploadFile = (file, onProgress) => {
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: 'image-pwa-upload' },
    });

    const params = { Bucket: 'image-pwa-upload', Key: file.name, Body: file };
    return new Promise((resolve, reject) => {
        const request = s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
        request.on('httpUploadProgress', (progress) => {
            onProgress(progress);
        });
    });
};

export const deleteFile = (Key) => {
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: 'image-pwa-upload' },
    });

    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: 'image-pwa-upload',
            Key,
        }, (err, data) => {
            if (err) {
                reject(err, err.stack);
            } else {
                resolve(data);
            }
        });
    });
};
