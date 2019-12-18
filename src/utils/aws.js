import document from 'global/document';
import window from 'global/window';
import AWS from 'aws-sdk';

const region = 'eu-central-1';
const Bucket = 'image-pwa-upload';

AWS.config.update({
    region,
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
        region,
        params: { Bucket },
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
    const params = { Bucket, Key };
    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        region,
        params: { Bucket },
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
        region,
        params: { Bucket },
    });

    const params = {
        Bucket,
        Key: file.name,
        Body: file,
        ACL: 'public-read',
        StorageClass: 'ONEZONE_IA',
    };
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
        region,
        params: { Bucket },
    });

    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket,
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
